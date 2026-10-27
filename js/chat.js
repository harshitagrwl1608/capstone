/**
 * PeerPath - In-Session Chat Module
 * Implements lightweight real-time chat window stored in localStorage
 * as specified in Synopsis Chapter 2.3
 */

const PeerPathChat = {
  activeSessionId: null,

  init() {
    this.setupListeners();
  },

  setupListeners() {
    const form = document.getElementById('chatInputForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    }

    const input = document.getElementById('chatMessageInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // When active user switches, re-render chat if open
    window.addEventListener('peerpath:userChanged', () => {
      if (this.activeSessionId) {
        this.renderMessages();
      }
    });
  },

  open(sessionId) {
    const session = PeerPathData.getSessionById(sessionId);
    if (!session) return;

    this.activeSessionId = sessionId;

    const currentUser = PeerPathData.getActiveUser();
    const isRequester = currentUser && session.requesterId === currentUser.id;
    const partnerId = isRequester ? session.targetId : session.requesterId;
    const partnerName = isRequester ? session.targetName : session.requesterName;
    const partner = PeerPathData.getUserById(partnerId);

    // Chat Header info
    document.getElementById('chatPartnerName').textContent = partnerName;
    document.getElementById('chatSkillTopic').textContent = `Skill: ${session.skill}`;
    
    // Quick Video Call button in chat header
    const videoBtn = document.getElementById('chatQuickVideoBtn');
    if (videoBtn) {
      if (session.status === 'confirmed') {
        videoBtn.style.display = 'inline-flex';
        videoBtn.onclick = () => {
          PeerPathSessions.joinVideoCall(session.meetingUrl, session.skill);
        };
      } else {
        videoBtn.style.display = 'none';
      }
    }

    // Modal display
    document.getElementById('chatModal').classList.add('active');

    // Render messages & scroll to bottom
    this.renderMessages();

    // Focus input
    setTimeout(() => {
      const input = document.getElementById('chatMessageInput');
      if (input) input.focus();
    }, 150);
  },

  close() {
    document.getElementById('chatModal').classList.remove('active');
    this.activeSessionId = null;
  },

  renderMessages() {
    if (!this.activeSessionId) return;

    const session = PeerPathData.getSessionById(this.activeSessionId);
    if (!session) return;

    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    const currentUser = PeerPathData.getActiveUser();
    const messages = session.messages || [];

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="chat-empty-state">
          <span class="chat-empty-icon">💬</span>
          <p>No messages yet in this exchange session.</p>
          <small>Say hello and coordinate your upcoming 1-hour session!</small>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(msg => {
      const isMine = currentUser && msg.senderId === currentUser.id;
      const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return `
        <div class="chat-bubble-wrapper ${isMine ? 'mine' : 'theirs'}">
          ${!isMine ? `<div class="chat-sender-name">${msg.senderName}</div>` : ''}
          <div class="chat-bubble">
            <p class="chat-text">${this.escapeHtml(msg.text)}</p>
            <span class="chat-timestamp">${formattedTime}</span>
          </div>
        </div>
      `;
    }).join('');

    // Scroll container to bottom
    container.scrollTop = container.scrollHeight;
  },

  sendMessage() {
    // In Progress (Phase 2): Real-time chat transmission logic under development
    const input = document.getElementById('chatMessageInput');
    if (input) input.value = '';
    return;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

window.PeerPathChat = PeerPathChat;
