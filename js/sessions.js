/**
 * PeerPath - Session Request & Video Conferencing Module
 * Implements Session Request, Accept/Decline, Jitsi Meet Video Call,
 * and Status Transitions as specified in Synopsis Chapter 2.3
 */

const PeerPathSessions = {
  currentFilter: 'all',
  targetPeerId: null,

  init() {
    this.renderSessions();
    this.setupListeners();
  },

  setupListeners() {
    // Listen for storage or session updates
    window.addEventListener('peerpath:userChanged', () => {
      this.renderSessions();
    });
  },

  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update tab button classes
    const tabs = document.querySelectorAll('.session-tab-btn');
    tabs.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
      }
    });

    this.renderSessions();
  },

  openRequestModal(peerId) {
    const currentUser = PeerPathData.getActiveUser();
    if (!currentUser) {
      PeerPathApp.showToast('Please sign in to request a session.', 'warning');
      return;
    }

    if (currentUser.isAdmin) {
      PeerPathApp.showToast('Admin accounts cannot initiate peer exchange requests.', 'warning');
      return;
    }

    const peer = PeerPathData.getUserById(peerId);
    if (!peer) {
      PeerPathApp.showToast('Selected peer could not be found.', 'error');
      return;
    }

    if (
      String(currentUser.id) === String(peer.id) ||
      (currentUser.email && peer.email && currentUser.email.toLowerCase().trim() === peer.email.toLowerCase().trim()) ||
      (currentUser.name && peer.name && currentUser.name.toLowerCase().trim() === peer.name.toLowerCase().trim())
    ) {
      PeerPathApp.showToast('You cannot request a session or demo class with yourself!', 'warning');
      return;
    }

    this.targetPeerId = peerId;

    document.getElementById('requestModalPeerName').textContent = peer.name;
    document.getElementById('requestModalPeerCollege').textContent = `${peer.college} • ${peer.branch}`;

    // Populate skill select with the peer's teachable skills
    const skillSelect = document.getElementById('requestSkillSelect');
    skillSelect.innerHTML = (peer.skillsTeach || []).map(skill => 
      `<option value="${skill}">${skill} (Taught by ${peer.name})</option>`
    ).join('');

    // Pre-fill date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('requestDateInput');
    if (dateInput) {
      dateInput.value = dateStr;
      dateInput.min = todayStr;
    }
    document.getElementById('requestTimeInput').value = '17:00';
    document.getElementById('requestNoteInput').value = `Hi ${peer.name}, I would love to connect for a 1-hour peer exchange session!`;

    document.getElementById('sessionRequestModal').classList.add('active');
  },

  closeRequestModal() {
    document.getElementById('sessionRequestModal').classList.remove('active');
    this.targetPeerId = null;
  },

  submitRequest(event) {
    event.preventDefault();
    const currentUser = PeerPathData.getActiveUser();
    const peer = PeerPathData.getUserById(this.targetPeerId);

    if (!currentUser || !peer) return;

    if (
      String(currentUser.id) === String(peer.id) ||
      (currentUser.email && peer.email && currentUser.email.toLowerCase().trim() === peer.email.toLowerCase().trim()) ||
      (currentUser.name && peer.name && currentUser.name.toLowerCase().trim() === peer.name.toLowerCase().trim())
    ) {
      PeerPathApp.showToast('You cannot request a session with yourself!', 'warning');
      return;
    }

    const skill = document.getElementById('requestSkillSelect').value;
    const scheduledDate = document.getElementById('requestDateInput').value;
    const scheduledTime = document.getElementById('requestTimeInput').value;
    const note = document.getElementById('requestNoteInput').value.trim();

    if (!skill || !scheduledDate || !scheduledTime) {
      PeerPathApp.showToast('Please fill in all session details.', 'warning');
      return;
    }

    const newSession = PeerPathData.addSession({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      targetId: peer.id,
      targetName: peer.name,
      skill,
      scheduledDate,
      scheduledTime,
      note
    });

    this.closeRequestModal();
    PeerPathAuth.updateNotificationBadge();
    PeerPathAuth.checkPendingAlert();

    PeerPathApp.showToast(`Skill exchange request successfully sent to ${peer.name}!`, 'success');

    // Switch to sessions tab and render
    PeerPathApp.switchTab('sessions');
    this.setFilter('pending');
  },

  acceptSession(sessionId) {
    const session = PeerPathData.getSessionById(sessionId);
    if (!session) return;

    // Transition to confirmed
    PeerPathData.updateSession(sessionId, { status: 'confirmed' });

    // Send an automated greeting in chat
    const currentUser = PeerPathData.getActiveUser();
    PeerPathData.addMessageToSession(sessionId, {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: `Hello! I have accepted the session request for ${session.skill}. Let's connect over the video link at the scheduled time!`
    });

    PeerPathAuth.updateNotificationBadge();
    PeerPathAuth.checkPendingAlert();
    this.renderSessions();

    PeerPathApp.showToast(`Session with ${session.requesterName} is now CONFIRMED! Video room is ready.`, 'success');
  },

  declineSession(sessionId) {
    const session = PeerPathData.getSessionById(sessionId);
    if (!session) return;

    if (confirm(`Are you sure you want to decline this session request for ${session.skill}?`)) {
      PeerPathData.deleteSession(sessionId);
      PeerPathAuth.updateNotificationBadge();
      PeerPathAuth.checkPendingAlert();
      this.renderSessions();
      PeerPathApp.showToast('Session request declined and removed.', 'info');
    }
  },

  markCompleted(sessionId) {
    const session = PeerPathData.getSessionById(sessionId);
    if (!session) return;

    PeerPathData.updateSession(sessionId, { status: 'completed' });
    this.renderSessions();
    PeerPathApp.showToast('Session marked as completed! Please take a moment to rate your peer.', 'success');

    // Determine who the peer is
    const currentUser = PeerPathData.getActiveUser();
    const peerId = (session.requesterId === currentUser.id) ? session.targetId : session.requesterId;
    const peerName = (session.requesterId === currentUser.id) ? session.targetName : session.requesterName;

    // Trigger rating modal
    PeerPathRating.openModal(sessionId, peerId, peerName, session.skill);
  },

  joinVideoCall(meetingUrl, skillName) {
    // Open Jitsi Meet in new tab
    if (!meetingUrl) {
      PeerPathApp.showToast('Meeting link unavailable.', 'error');
      return;
    }
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    PeerPathApp.showToast(`Opening Jitsi Video Room for "${skillName}"...`, 'info');
  },

  renderSessions() {
    const container = document.getElementById('sessionsListContainer');
    const emptyState = document.getElementById('sessionsEmptyState');
    if (!container) return;

    const currentUser = PeerPathData.getActiveUser();
    if (!currentUser) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      this.updateTabCounts([]);
      return;
    }

    const allSessions = PeerPathData.getSessions();

    // Filter sessions relevant to the active user (or all if admin)
    let userSessions = allSessions.filter(s => {
      if (currentUser.isAdmin) return true;
      return s.requesterId === currentUser.id || s.targetId === currentUser.id;
    });

    // Update tab counter badges
    this.updateTabCounts(userSessions);

    // Apply status filter
    if (this.currentFilter !== 'all') {
      userSessions = userSessions.filter(s => s.status === this.currentFilter);
    }

    if (userSessions.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = userSessions.map(sess => this.createSessionCardHtml(sess, currentUser)).join('');
  },

  updateTabCounts(sessions) {
    const countAll = sessions.length;
    const countPending = sessions.filter(s => s.status === 'pending').length;
    const countConfirmed = sessions.filter(s => s.status === 'confirmed').length;
    const countCompleted = sessions.filter(s => s.status === 'completed').length;

    const setBadge = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };

    setBadge('countAllSessions', countAll);
    setBadge('countPendingSessions', countPending);
    setBadge('countConfirmedSessions', countConfirmed);
    setBadge('countCompletedSessions', countCompleted);
  },

  createSessionCardHtml(session, currentUser) {
    const isRequester = session.requesterId === currentUser.id;
    const partnerId = isRequester ? session.targetId : session.requesterId;
    const partnerName = isRequester ? session.targetName : session.requesterName;
    const partner = PeerPathData.getUserById(partnerId);
    const partnerCollege = partner ? partner.college : 'Campus Student';
    const partnerColor = partner ? (partner.avatarColor || '#6366f1') : '#6366f1';
    const initials = partnerName.split(' ').map(n => n[0]).join('').slice(0, 2);

    const messageCount = (session.messages || []).length;

    let statusBadgeClass = 'status-pending';
    let statusLabel = 'Pending Review';
    if (session.status === 'confirmed') {
      statusBadgeClass = 'status-confirmed';
      statusLabel = 'Confirmed & Ready';
    } else if (session.status === 'completed') {
      statusBadgeClass = 'status-completed';
      statusLabel = 'Completed';
    }

    // Role badge (Incoming vs Outgoing)
    let directionBadge = '';
    if (!currentUser.isAdmin) {
      if (!isRequester) {
        directionBadge = '<span class="direction-badge incoming">📥 Incoming Request</span>';
      } else {
        directionBadge = '<span class="direction-badge outgoing">📤 Sent by You</span>';
      }
    }

    // Actions block based on status
    let actionButtonsHtml = '';

    if (session.status === 'pending') {
      if (!isRequester && !currentUser.isAdmin) {
        // Active user is the receiver -> can Accept or Decline
        actionButtonsHtml = `
          <div class="session-actions-row">
            <button class="btn btn-success btn-sm" onclick="PeerPathSessions.acceptSession('${session.id}')">
              ✓ Accept Request
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="PeerPathSessions.declineSession('${session.id}')">
              ✕ Decline
            </button>
          </div>
        `;
      } else {
        // Active user sent this request
        actionButtonsHtml = `
          <div class="session-actions-row">
            <span class="status-note">Waiting for ${partnerName} to accept...</span>
            <button class="btn btn-outline-danger btn-xs" onclick="PeerPathSessions.declineSession('${session.id}')">
              Cancel Request
            </button>
          </div>
        `;
      }
    } else if (session.status === 'confirmed') {
      actionButtonsHtml = `
        <div class="session-actions-row">
          <button class="btn btn-video btn-sm" onclick="PeerPathSessions.joinVideoCall('${session.meetingUrl}', '${session.skill}')">
            🎥 Join Video Call (Jitsi)
          </button>
          <button class="btn btn-chat btn-sm" onclick="PeerPathChat.open('${session.id}')">
            💬 Open Chat ${messageCount > 0 ? `(${messageCount})` : ''}
          </button>
          <button class="btn btn-outline btn-sm" onclick="PeerPathSessions.markCompleted('${session.id}')">
            ✓ Mark Completed
          </button>
        </div>
      `;
    } else if (session.status === 'completed') {
      // Check rating status
      const hasRated = isRequester ? !!session.ratingByRequester : !!session.ratingByTarget;
      const givenScore = isRequester ? session.ratingByRequester : session.ratingByTarget;

      actionButtonsHtml = `
        <div class="session-actions-row">
          <button class="btn btn-chat btn-sm" onclick="PeerPathChat.open('${session.id}')">
            💬 View Chat History
          </button>
          ${!hasRated ? `
            <button class="btn btn-accent btn-sm" onclick="PeerPathRating.openModal('${session.id}', '${partnerId}', '${partnerName}', '${session.skill}')">
              ⭐ Rate Peer (1–5 ★)
            </button>
          ` : `
            <span class="rated-badge">★ You rated: ${givenScore}/5</span>
          `}
        </div>
      `;
    }

    return `
      <div class="session-card" id="sessionCard_${session.id}">
        <div class="session-card-top">
          <div class="session-user-pair">
            <div class="session-partner-avatar" style="background-color: ${partnerColor}">
              ${initials}
            </div>
            <div>
              <div class="session-partner-name">${partnerName}</div>
              <div class="session-partner-college">${partnerCollege}</div>
            </div>
          </div>
          <div class="session-badges">
            ${directionBadge}
            <span class="status-pill ${statusBadgeClass}">${statusLabel}</span>
          </div>
        </div>

        <div class="session-details-body">
          <div class="session-detail-item">
            <span class="detail-label">Skill Exchanged:</span>
            <span class="detail-value highlight-skill">${session.skill}</span>
          </div>
          <div class="session-detail-item">
            <span class="detail-label">Scheduled Date & Time:</span>
            <span class="detail-value">📅 ${session.scheduledDate} at 🕒 ${session.scheduledTime}</span>
          </div>
          ${session.note ? `
            <div class="session-note-box">
              <span class="note-label">Message:</span> "${session.note}"
            </div>
          ` : ''}
        </div>

        <div class="session-card-bottom">
          ${actionButtonsHtml}
        </div>
      </div>
    `;
  }
};

window.PeerPathSessions = PeerPathSessions;
