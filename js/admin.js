/**
 * PeerPath - Admin & Campus Moderation Module
 * Implements Platform-wide analytics, user profile moderation,
 * and review/approval of student self-registration requests.
 */

const PeerPathAdmin = {
  init() {
    this.render();
  },

  render() {
    const currentUser = PeerPathData.getLoggedInUser();
    if (!currentUser || !currentUser.isAdmin) {
      // Access denied for non-admins
      return;
    }

    this.renderMetrics();
    this.renderRegistrationRequestsTable();
    this.renderUsersTable();
  },

  renderMetrics() {
    const users = PeerPathData.getUsers();
    const sessions = PeerPathData.getSessions();
    const regRequests = PeerPathData.getRegistrationRequests();

    const totalStudents = users.length;
    const totalSessions = sessions.length;
    const confirmedSessions = sessions.filter(s => s.status === 'confirmed').length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const pendingRegistrations = regRequests.filter(r => r.status === 'pending').length;

    // Calculate platform average rating
    const ratingsArray = users.map(u => u.rating).filter(Boolean);
    const avgRating = ratingsArray.length > 0 
      ? (ratingsArray.reduce((acc, curr) => acc + curr, 0) / ratingsArray.length).toFixed(2)
      : '5.0';

    // Unique skills taught
    const allSkills = new Set();
    users.forEach(u => (u.skillsTeach || []).forEach(s => allSkills.add(s)));

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('adminTotalStudents', totalStudents);
    setEl('adminTotalSessions', totalSessions);
    setEl('adminConfirmedSessions', confirmedSessions);
    setEl('adminCompletedSessions', completedSessions);
    setEl('adminPendingRegistrations', pendingRegistrations);
    setEl('adminAvgRating', `★ ${avgRating}`);
    setEl('adminUniqueSkills', allSkills.size);

    // Update pending badge in admin section title
    const pendingBadge = document.getElementById('adminPendingBadge');
    if (pendingBadge) {
      if (pendingRegistrations > 0) {
        pendingBadge.textContent = `${pendingRegistrations} Action Required`;
        pendingBadge.style.display = 'inline-block';
      } else {
        pendingBadge.style.display = 'none';
      }
    }
  },

  renderRegistrationRequestsTable() {
    const tableBody = document.getElementById('adminRegRequestsTableBody');
    const emptyState = document.getElementById('adminRegEmptyState');
    if (!tableBody) return;

    const allRequests = PeerPathData.getRegistrationRequests();
    const pendingRequests = allRequests.filter(r => r.status === 'pending');

    if (pendingRequests.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = pendingRequests.map(req => {
      const teachBadges = (req.skillsTeach || []).map(s => `<span class="badge badge-subtle-emerald">${s}</span>`).join(' ');
      const learnBadges = (req.skillsLearn || []).map(s => `<span class="badge badge-subtle-indigo">${s}</span>`).join(' ');
      const requestDate = new Date(req.requestedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <div class="table-user-avatar" style="background-color: #6366f1">
                ${req.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <strong>${req.name}</strong>
                <div class="text-muted text-xs">Roll: ${req.rollNumber || 'N/A'}</div>
                <div class="text-muted text-xs">${req.email}</div>
              </div>
            </div>
          </td>
          <td>
            <div>${req.college}</div>
            <div class="text-muted text-xs">${req.branch} • ${req.year}</div>
          </td>
          <td>
            <div>${teachBadges}</div>
          </td>
          <td>
            <div>${learnBadges}</div>
          </td>
          <td>
            <div class="text-xs text-muted">📅 ${requestDate}</div>
            ${req.bio ? `<div class="text-xs text-secondary italic">"${req.bio}"</div>` : ''}
          </td>
          <td>
            <div class="action-cell">
              <button class="btn btn-success btn-xs" onclick="PeerPathAdmin.approveRegistration('${req.id}')" title="Approve student registration">
                ✓ Approve
              </button>
              <button class="btn btn-outline-danger btn-xs" onclick="PeerPathAdmin.rejectRegistration('${req.id}')" title="Decline student registration">
                ✕ Reject
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  approveRegistration(requestId) {
    const newUser = PeerPathData.approveRegistrationRequest(requestId);
    if (newUser) {
      PeerPathApp.showToast(`Registration for "${newUser.name}" APPROVED! The student can now log in.`, 'success');
      this.renderMetrics();
      this.renderRegistrationRequestsTable();
      this.renderUsersTable();
      PeerPathAuth.checkPendingAlert();
    }
  },

  rejectRegistration(requestId) {
    const reason = prompt('Enter a reason for rejecting this registration request (optional):', 'Campus verification failed');
    if (reason !== null) {
      const req = PeerPathData.rejectRegistrationRequest(requestId, reason);
      if (req) {
        PeerPathApp.showToast(`Registration request for "${req.name}" declined.`, 'info');
        this.renderMetrics();
        this.renderRegistrationRequestsTable();
        PeerPathAuth.checkPendingAlert();
      }
    }
  },

  renderUsersTable() {
    const tableBody = document.getElementById('adminUsersTableBody');
    if (!tableBody) return;

    const users = PeerPathData.getUsers();
    const sessions = PeerPathData.getSessions();

    tableBody.innerHTML = users.map(user => {
      const userSessions = sessions.filter(s => s.requesterId === user.id || s.targetId === user.id);
      const teachBadges = (user.skillsTeach || []).map(s => `<span class="badge badge-subtle-emerald">${s}</span>`).join(' ');
      const learnBadges = (user.skillsLearn || []).map(s => `<span class="badge badge-subtle-indigo">${s}</span>`).join(' ');

      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <div class="table-user-avatar" style="background-color: ${user.avatarColor || '#6366f1'}">
                ${user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <strong>${user.name}</strong>
                <div class="text-muted text-xs">${user.email}</div>
                <div class="text-muted text-xs">Roll: ${user.rollNumber || 'N/A'}</div>
              </div>
            </div>
          </td>
          <td>
            <div>${user.college}</div>
            <div class="text-muted text-xs">${user.branch} • ${user.year}</div>
          </td>
          <td>
            <div>${teachBadges}</div>
          </td>
          <td>
            <div>${learnBadges}</div>
          </td>
          <td>
            <span class="star-rating-pill">★ ${user.rating ? user.rating.toFixed(1) : '5.0'} (${user.totalRatings || 0})</span>
          </td>
          <td>
            <span class="count-pill">${userSessions.length}</span>
          </td>
          <td>
            <div class="action-cell">
              <button class="btn btn-outline btn-xs" onclick="PeerPathDiscovery.openPeerDetailsModal('${user.id}')">
                Profile
              </button>
              <button class="btn btn-danger btn-xs" onclick="PeerPathAdmin.removeUser('${user.id}', '${user.name.replace(/'/g, "\\'")}')">
                Remove
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  removeUser(userId, userName) {
    if (confirm(`ADMIN ACTION: Are you sure you want to remove ${userName}'s profile from the campus network?`)) {
      PeerPathData.deleteUser(userId);
      this.renderMetrics();
      this.renderUsersTable();
      PeerPathApp.showToast(`User profile for "${userName}" was removed by administrator.`, 'info');
    }
  },

  openAddStudentModal() {
    document.getElementById('addStudentModal').classList.add('active');
  },

  closeAddStudentModal() {
    document.getElementById('addStudentModal').classList.remove('active');
  },

  handleAddStudentSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('newStudentName').value.trim();
    const college = document.getElementById('newStudentCollege').value.trim();
    const branch = document.getElementById('newStudentBranch').value.trim();
    const year = document.getElementById('newStudentYear').value;
    const email = document.getElementById('newStudentEmail').value.trim();
    const teach1 = document.getElementById('newStudentTeach1').value.trim();
    const teach2 = document.getElementById('newStudentTeach2').value.trim();
    const learn1 = document.getElementById('newStudentLearn1').value.trim();
    const learn2 = document.getElementById('newStudentLearn2').value.trim();
    const availability = document.getElementById('newStudentAvailability').value.trim();
    const bio = document.getElementById('newStudentBio').value.trim();

    const skillsTeach = [teach1, teach2].filter(Boolean);
    const skillsLearn = [learn1, learn2].filter(Boolean);

    if (!name || skillsTeach.length === 0 || skillsLearn.length === 0) {
      PeerPathApp.showToast('Please specify student name and at least 1 skill to teach and learn.', 'warning');
      return;
    }

    const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    PeerPathData.addUser({
      name,
      college,
      branch,
      year,
      email,
      password: 'peerpath123',
      skillsTeach,
      skillsLearn,
      availability,
      bio,
      avatarColor: randomColor
    });

    this.closeAddStudentModal();
    this.renderMetrics();
    this.renderUsersTable();
    PeerPathApp.showToast(`New student "${name}" added to campus roster!`, 'success');
  }
};

window.PeerPathAdmin = PeerPathAdmin;
