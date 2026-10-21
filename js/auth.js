/**
 * PeerPath - Authentication & Session Guard Module
 * Enforces per-user login, logout, role-based access, and self-registration with admin approval.
 */

const PeerPathAuth = {
  init() {
    this.setupListeners();
    this.checkSession();
  },

  checkSession() {
    const user = PeerPathData.getLoggedInUser();
    if (!user) {
      this.showAuthScreen();
    } else {
      this.showAppScreen(user);
    }
  },

  showAuthScreen() {
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');

    if (authContainer) authContainer.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';

    // Clear password and errors
    const pwdInput = document.getElementById('loginPassword');
    if (pwdInput) pwdInput.value = '';
    const errBox = document.getElementById('loginErrorBox');
    if (errBox) errBox.style.display = 'none';

    this.renderPendingRequestsNotice();
  },

  showAppScreen(user) {
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');

    if (authContainer) authContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';

    this.updateCurrentDisplay();
  },

  renderPendingRequestsNotice() {
    const noticeEl = document.getElementById('loginPendingNotice');
    if (!noticeEl) return;

    const requests = PeerPathData.getRegistrationRequests();
    const pending = requests.filter(r => r.status === 'pending');

    if (pending.length > 0) {
      noticeEl.innerHTML = `
        <div class="pending-notice-box">
          <span class="notice-icon">📋</span>
          <div>
            <strong>${pending.length} Campus Registration Request(s) Pending Review</strong>
            <p class="text-xs">Log in with the Administrator account (<code>admin@peerpath.edu</code> / <code>admin123</code>) to review and approve registrations.</p>
          </div>
        </div>
      `;
      noticeEl.style.display = 'block';
    } else {
      noticeEl.style.display = 'none';
    }
  },

  updateCurrentDisplay() {
    const currentUser = PeerPathData.getLoggedInUser();
    if (!currentUser) return;

    // Navbar user info
    const avatarEl = document.getElementById('currentUserAvatar');
    const nameEl = document.getElementById('currentUserName');
    const collegeEl = document.getElementById('currentUserCollege');
    const roleBadgeEl = document.getElementById('currentUserRoleBadge');

    if (avatarEl) {
      avatarEl.style.backgroundColor = currentUser.avatarColor || (currentUser.isAdmin ? '#dc2626' : '#4f46e5');
      avatarEl.textContent = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    }
    if (nameEl) nameEl.textContent = currentUser.name;
    if (collegeEl) collegeEl.textContent = currentUser.college;

    if (roleBadgeEl) {
      if (currentUser.isAdmin) {
        roleBadgeEl.textContent = 'Admin Moderator';
        roleBadgeEl.className = 'user-badge-role badge-admin';
      } else {
        roleBadgeEl.textContent = `${currentUser.branch} • ${currentUser.year}`;
        roleBadgeEl.className = 'user-badge-role';
      }
    }

    // Role-based visibility for Admin Navigation Tab
    const adminNavTab = document.getElementById('navBtnAdmin');
    if (adminNavTab) {
      if (currentUser.isAdmin) {
        adminNavTab.style.display = 'inline-flex';
      } else {
        adminNavTab.style.display = 'none';
      }
    }

    // Update notifications indicator for current user
    this.updateNotificationBadge();
    this.checkPendingAlert();
  },

  updateNotificationBadge() {
    const badge = document.getElementById('sessionNotificationBadge');
    if (!badge) return;

    const currentUser = PeerPathData.getLoggedInUser();
    if (!currentUser || currentUser.isAdmin) {
      badge.style.display = 'none';
      return;
    }

    const sessions = PeerPathData.getSessions();
    const pendingIncoming = sessions.filter(s => s.targetId === currentUser.id && s.status === 'pending');
    
    if (pendingIncoming.length > 0) {
      badge.textContent = pendingIncoming.length;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  },

  checkPendingAlert() {
    const alertBox = document.getElementById('pendingRequestsBanner');
    if (!alertBox) return;

    const currentUser = PeerPathData.getLoggedInUser();
    if (!currentUser) {
      alertBox.style.display = 'none';
      return;
    }

    // If Admin, show alert if there are pending registration requests!
    if (currentUser.isAdmin) {
      const requests = PeerPathData.getRegistrationRequests();
      const pendingRegs = requests.filter(r => r.status === 'pending');
      if (pendingRegs.length > 0) {
        alertBox.style.display = 'flex';
        alertBox.innerHTML = `
          <div class="banner-content">
            <span class="banner-icon">📋</span>
            <div class="banner-text">
              <strong>Admin Alert:</strong> You have <strong>${pendingRegs.length} pending student registration request(s)</strong> awaiting review.
            </div>
          </div>
          <button class="btn btn-sm btn-accent" onclick="PeerPathApp.switchTab('admin')">Review Registrations</button>
        `;
        return;
      }
    }

    // If Student, show incoming session requests
    const sessions = PeerPathData.getSessions();
    const pendingIncoming = sessions.filter(s => s.targetId === currentUser.id && s.status === 'pending');

    if (pendingIncoming.length > 0) {
      alertBox.style.display = 'flex';
      const firstReq = pendingIncoming[0];
      alertBox.innerHTML = `
        <div class="banner-content">
          <span class="banner-icon">🔔</span>
          <div class="banner-text">
            <strong>Incoming Session Request:</strong> ${firstReq.requesterName} wants to learn <em>${firstReq.skill}</em> with you on ${firstReq.scheduledDate} at ${firstReq.scheduledTime}.
          </div>
        </div>
        <button class="btn btn-sm btn-accent" onclick="PeerPathApp.switchTab('sessions'); PeerPathSessions.setFilter('pending');">Review Request (${pendingIncoming.length})</button>
      `;
    } else {
      alertBox.style.display = 'none';
    }
  },

  setupListeners() {
    // Auth Tab switching (Sign In vs Register)
    const tabSignIn = document.getElementById('authTabSignIn');
    const tabRegister = document.getElementById('authTabRegister');
    const formSignIn = document.getElementById('signInFormContainer');
    const formRegister = document.getElementById('registerFormContainer');

    if (tabSignIn && tabRegister) {
      tabSignIn.addEventListener('click', () => {
        tabSignIn.classList.add('tab-active');
        tabRegister.classList.remove('tab-active');
        if (formSignIn) formSignIn.style.display = 'block';
        if (formRegister) formRegister.style.display = 'none';
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('tab-active');
        tabSignIn.classList.remove('tab-active');
        if (formSignIn) formSignIn.style.display = 'none';
        if (formRegister) formRegister.style.display = 'block';
      });
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Registration Form Submission
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegistration();
      });
    }

    // Global session events
    window.addEventListener('peerpath:userChanged', (e) => {
      const user = e.detail.user || PeerPathData.getLoggedInUser();
      if (user) {
        this.showAppScreen(user);
        PeerPathApp.refreshCurrentView();
      } else {
        this.showAuthScreen();
      }
    });

    window.addEventListener('peerpath:loggedOut', () => {
      this.showAuthScreen();
      PeerPathApp.showToast('You have been logged out.', 'info');
    });

    window.addEventListener('peerpath:dataReset', () => {
      this.checkSession();
      PeerPathApp.showToast('Demo data and accounts reset to initial campus state!', 'success');
      PeerPathApp.refreshCurrentView();
    });
  },

  handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorBox = document.getElementById('loginErrorBox');

    if (!email || !password) {
      if (errorBox) {
        errorBox.textContent = 'Please enter both your campus email and password.';
        errorBox.style.display = 'block';
      }
      return;
    }

    const result = PeerPathData.authenticate(email, password);

    if (result.success) {
      if (errorBox) errorBox.style.display = 'none';
      PeerPathApp.showToast(`Welcome back, ${result.user.name}!`, 'success');
      this.showAppScreen(result.user);
      
      // If admin, navigate to Admin panel
      if (result.user.isAdmin) {
        PeerPathApp.switchTab('admin');
      } else {
        PeerPathApp.switchTab('discovery');
      }
    } else {
      if (errorBox) {
        errorBox.textContent = result.error;
        errorBox.style.display = 'block';
      }
      PeerPathApp.showToast(result.error, 'error');
    }
  },

  handleRegistration() {
    const name = document.getElementById('regName').value.trim();
    const rollNumber = document.getElementById('regRollNumber').value.trim();
    const college = document.getElementById('regCollege').value.trim();
    const branch = document.getElementById('regBranch').value.trim();
    const year = document.getElementById('regYear').value;
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    const teach1 = document.getElementById('regTeach1').value.trim();
    const teach2 = document.getElementById('regTeach2').value.trim();
    const skillsTeach = [teach1, teach2].filter(Boolean);

    const learn1 = document.getElementById('regLearn1').value.trim();
    const learn2 = document.getElementById('regLearn2').value.trim();
    const skillsLearn = [learn1, learn2].filter(Boolean);

    const availability = document.getElementById('regAvailability').value.trim();
    const bio = document.getElementById('regBio').value.trim();

    const errorBox = document.getElementById('regErrorBox');

    // Validation
    if (!name || !email || !password || skillsTeach.length === 0 || skillsLearn.length === 0) {
      if (errorBox) {
        errorBox.textContent = 'Please fill out all required fields and specify at least 1 skill to teach and learn.';
        errorBox.style.display = 'block';
      }
      return;
    }

    // Check if email already registered
    const existingUser = PeerPathData.getUserByEmail(email);
    if (existingUser) {
      if (errorBox) {
        errorBox.textContent = 'An active account with this email already exists! Please log in.';
        errorBox.style.display = 'block';
      }
      return;
    }

    // Check if duplicate pending request
    const requests = PeerPathData.getRegistrationRequests();
    const existingReq = requests.find(r => r.email.toLowerCase() === email.toLowerCase() && r.status === 'pending');
    if (existingReq) {
      if (errorBox) {
        errorBox.textContent = 'A registration request for this email is already awaiting Admin approval!';
        errorBox.style.display = 'block';
      }
      return;
    }

    if (errorBox) errorBox.style.display = 'none';

    // Submit self-registration request
    PeerPathData.addRegistrationRequest({
      name,
      rollNumber,
      college,
      branch,
      year,
      email,
      password,
      skillsTeach,
      skillsLearn,
      availability,
      bio
    });

    // Reset form
    document.getElementById('registrationForm').reset();

    // Show success dialog / toast
    PeerPathApp.showToast(`Registration request submitted for ${name}! It will be reviewed by the Administrator.`, 'success');

    // Switch to Sign In tab and show confirmation notice
    const tabSignIn = document.getElementById('authTabSignIn');
    if (tabSignIn) tabSignIn.click();

    const successBox = document.getElementById('loginSuccessNotice');
    if (successBox) {
      successBox.innerHTML = `
        <strong>✓ Registration Request Submitted!</strong><br>
        Your application for <em>${email}</em> has been sent to the Admin Moderator for campus verification. Once approved, you can log in with your password.
      `;
      successBox.style.display = 'block';
    }

    this.renderPendingRequestsNotice();
  },

  quickDemoLogin(email, password) {
    const tabSignIn = document.getElementById('authTabSignIn');
    if (tabSignIn) tabSignIn.click();
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    this.handleLogin();
  },

  logout() {
    PeerPathData.logoutUser();
  },

  // Edit profile modal
  openEditProfileModal() {
    const user = PeerPathData.getLoggedInUser();
    if (!user || user.isAdmin) return;

    document.getElementById('editName').value = user.name || '';
    document.getElementById('editCollege').value = user.college || '';
    document.getElementById('editYear').value = user.year || '1st Year';
    document.getElementById('editBranch').value = user.branch || '';
    document.getElementById('editAvailability').value = user.availability || '';
    document.getElementById('editBio').value = user.bio || '';

    // Skills to teach (up to 2)
    const teach = user.skillsTeach || [];
    const learn = user.skillsLearn || [];
    document.getElementById('editSkillTeach1').value = teach[0] || '';
    document.getElementById('editSkillTeach2').value = teach[1] || '';

    // Skills to learn (up to 2)
    document.getElementById('editSkillLearn1').value = learn[0] || '';
    document.getElementById('editSkillLearn2').value = learn[1] || '';

    document.getElementById('editProfileModal').classList.add('active');
  },

  closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('active');
  },

  saveProfileChanges(event) {
    event.preventDefault();
    const user = PeerPathData.getLoggedInUser();
    if (!user || user.isAdmin) return;

    const teach1 = document.getElementById('editSkillTeach1').value.trim();
    const teach2 = document.getElementById('editSkillTeach2').value.trim();
    const skillsTeach = [teach1, teach2].filter(Boolean);

    const learn1 = document.getElementById('editSkillLearn1').value.trim();
    const learn2 = document.getElementById('editSkillLearn2').value.trim();
    const skillsLearn = [learn1, learn2].filter(Boolean);

    if (skillsTeach.length === 0 || skillsLearn.length === 0) {
      PeerPathApp.showToast('Please provide at least 1 skill to teach and 1 skill to learn.', 'warning');
      return;
    }

    const updatedData = {
      name: document.getElementById('editName').value.trim(),
      college: document.getElementById('editCollege').value.trim(),
      year: document.getElementById('editYear').value,
      branch: document.getElementById('editBranch').value.trim(),
      availability: document.getElementById('editAvailability').value.trim(),
      bio: document.getElementById('editBio').value.trim(),
      skillsTeach,
      skillsLearn
    };

    PeerPathData.updateUser(user.id, updatedData);
    this.closeEditProfileModal();
    this.updateCurrentDisplay();
    PeerPathApp.showToast('Profile updated successfully!', 'success');
    PeerPathApp.refreshCurrentView();
  }
};

window.PeerPathAuth = PeerPathAuth;
