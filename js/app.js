/**
 * PeerPath - Main Application Controller & View Router
 * Coordinates modules, tabs, modal behaviors, toasts, and UI themes
 */

const PeerPathApp = {
  currentTab: 'discovery',

  init() {
    this.initTheme();
    this.setupNavigation();
    this.setupModals();
    
    // Initialize Auth first to check logged-in session
    PeerPathAuth.init();

    // Initialize sub-modules
    PeerPathDiscovery.init();
    PeerPathSessions.init();
    PeerPathChat.init();
    PeerPathRating.init();
    PeerPathAdmin.init();

    // Set initial view if logged in
    const user = PeerPathData.getLoggedInUser();
    if (user) {
      if (user.isAdmin) {
        this.switchTab('admin');
      } else {
        this.switchTab('discovery');
      }
    }
  },

  initTheme() {
    const savedTheme = localStorage.getItem(PeerPathData.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggleIcon(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(PeerPathData.STORAGE_KEYS.THEME, next);
        this.updateThemeToggleIcon(next);
      });
    }

    const authThemeToggleBtn = document.getElementById('authThemeToggleBtn');
    if (authThemeToggleBtn) {
      authThemeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(PeerPathData.STORAGE_KEYS.THEME, next);
        this.updateThemeToggleIcon(next);
      });
    }
  },

  updateThemeToggleIcon(theme) {
    const icons = document.querySelectorAll('.theme-icon-indicator');
    icons.forEach(icon => {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  },

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabName) {
    const currentUser = PeerPathData.getLoggedInUser();

    // Route Guard for Admin Panel
    if (tabName === 'admin') {
      if (!currentUser || !currentUser.isAdmin) {
        this.showToast('Access Denied: Only the campus administrator can view this area.', 'error');
        return;
      }
    }

    this.currentTab = tabName;

    // Update active nav button
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('nav-active', 'tab-active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('nav-active', 'tab-active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update active view section
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
      if (view.id === `view_${tabName}`) {
        view.classList.add('view-active');
      } else {
        view.classList.remove('view-active');
      }
    });

    // Refresh specific view data
    this.refreshCurrentView();

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  refreshCurrentView() {
    const currentUser = PeerPathData.getLoggedInUser();
    if (!currentUser) return;

    if (this.currentTab === 'discovery') {
      PeerPathDiscovery.renderCategoryChips();
      PeerPathDiscovery.renderFeed();
    } else if (this.currentTab === 'sessions') {
      PeerPathSessions.renderSessions();
    } else if (this.currentTab === 'profile') {
      this.renderProfileView();
    } else if (this.currentTab === 'admin') {
      PeerPathAdmin.render();
    }
  },

  renderProfileView() {
    const user = PeerPathData.getLoggedInUser();
    if (!user) return;

    const profileAvatar = document.getElementById('profileViewAvatar');
    const profileName = document.getElementById('profileViewName');
    const profileCollege = document.getElementById('profileViewCollege');
    const profileBranchYear = document.getElementById('profileViewBranchYear');
    const profileEmail = document.getElementById('profileViewEmail');
    const profileBio = document.getElementById('profileViewBio');
    const profileAvailability = document.getElementById('profileViewAvailability');
    const profileRating = document.getElementById('profileViewRating');
    const teachContainer = document.getElementById('profileSkillsTeach');
    const learnContainer = document.getElementById('profileSkillsLearn');

    if (profileAvatar) {
      profileAvatar.style.backgroundColor = user.avatarColor || '#4f46e5';
      profileAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    }
    if (profileName) profileName.textContent = user.name;
    if (profileCollege) profileCollege.textContent = user.college;
    if (profileBranchYear) profileBranchYear.textContent = `${user.branch} • ${user.year} (Roll: ${user.rollNumber || 'N/A'})`;
    if (profileEmail) profileEmail.textContent = user.email || 'N/A';
    if (profileBio) profileBio.textContent = user.bio || 'Campus student participating in peer knowledge barter.';
    if (profileAvailability) profileAvailability.textContent = user.availability || 'Flexible';
    if (profileRating) profileRating.textContent = `★ ${user.rating ? user.rating.toFixed(1) : '5.0'} (${user.totalRatings || 0} reviews)`;

    if (teachContainer) {
      teachContainer.innerHTML = (user.skillsTeach || []).map(s => `<span class="skill-tag tag-teach">${s}</span>`).join('');
    }
    if (learnContainer) {
      learnContainer.innerHTML = (user.skillsLearn || []).map(s => `<span class="skill-tag tag-learn">${s}</span>`).join('');
    }

    // Render this user's active session stats
    const sessions = PeerPathData.getSessions().filter(s => s.requesterId === user.id || s.targetId === user.id);
    const countCompleted = sessions.filter(s => s.status === 'completed').length;

    const statSessions = document.getElementById('profileStatSessions');
    const statExchanges = document.getElementById('profileStatExchanges');
    if (statSessions) statSessions.textContent = sessions.length;
    if (statExchanges) statExchanges.textContent = countCompleted;
  },

  setupModals() {
    // Backdrop click to close modals
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Escape key to close any active modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach(modal => modal.classList.remove('active'));
      }
    });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
};

window.PeerPathApp = PeerPathApp;

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  PeerPathApp.init();
});
