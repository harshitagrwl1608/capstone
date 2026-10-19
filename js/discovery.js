/**
 * PeerPath - Discovery & Peer Matching Module
 * Implements Discovery Feed, Search & Filter, and Skill-Barter Matching
 * as specified in Synopsis Chapter 2.3
 */

const PeerPathDiscovery = {
  currentCategory: 'All',
  searchQuery: '',

  init() {
    this.renderCategoryChips();
    this.renderFeed();
    this.setupListeners();
  },

  setupListeners() {
    const searchInput = document.getElementById('discoverySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderFeed();
      });
    }
  },

  renderCategoryChips() {
    const container = document.getElementById('categoryChipsContainer');
    if (!container) return;

    // Collect all unique skills taught across users
    const users = PeerPathData.getUsers();
    const skillsSet = new Set(['All']);
    users.forEach(u => {
      (u.skillsTeach || []).forEach(s => skillsSet.add(s));
    });

    const categories = Array.from(skillsSet);

    container.innerHTML = categories.map(cat => {
      const activeClass = this.currentCategory === cat ? 'chip-active' : '';
      return `<button class="category-chip ${activeClass}" onclick="PeerPathDiscovery.filterByCategory('${cat}')">${cat}</button>`;
    }).join('');
  },

  filterByCategory(category) {
    this.currentCategory = category;
    this.renderCategoryChips();
    this.renderFeed();
  },

  renderFeed() {
    const feedContainer = document.getElementById('discoveryGrid');
    const emptyState = document.getElementById('discoveryEmptyState');
    if (!feedContainer) return;

    const allUsers = PeerPathData.getUsers();
    const currentUser = PeerPathData.getActiveUser();

    // Filter out current active user (cannot trade with oneself) and admin accounts
    let peers = allUsers.filter(u => {
      if (!currentUser) return true;
      if (currentUser.id && String(u.id) === String(currentUser.id)) return false;
      if (currentUser.email && u.email && u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return false;
      if (currentUser.name && u.name && u.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) return false;
      // Do not show admin moderator in peer discovery list
      if (u.isAdmin || u.id === 'user_admin' || (u.email && u.email.toLowerCase().trim() === 'admin@peerpath.edu')) return false;
      return true;
    });

    // Apply category filter (skillsTeach includes selected category)
    if (this.currentCategory !== 'All') {
      peers = peers.filter(u => 
        (u.skillsTeach || []).some(s => s.toLowerCase() === this.currentCategory.toLowerCase())
      );
    }

    // Apply search query
    if (this.searchQuery) {
      peers = peers.filter(u => {
        const nameMatch = u.name.toLowerCase().includes(this.searchQuery);
        const collegeMatch = (u.college || '').toLowerCase().includes(this.searchQuery);
        const branchMatch = (u.branch || '').toLowerCase().includes(this.searchQuery);
        const teachMatch = (u.skillsTeach || []).some(s => s.toLowerCase().includes(this.searchQuery));
        const learnMatch = (u.skillsLearn || []).some(s => s.toLowerCase().includes(this.searchQuery));
        return nameMatch || collegeMatch || branchMatch || teachMatch || learnMatch;
      });
    }

    // Update peer count indicator
    const countBadge = document.getElementById('discoveryCountBadge');
    if (countBadge) {
      countBadge.textContent = `${peers.length} Peers Available`;
    }

    if (peers.length === 0) {
      feedContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Sort peers: prioritize complementary matches first
    if (currentUser && !currentUser.isAdmin) {
      peers.sort((a, b) => {
        const matchA = this.calculateMatchScore(currentUser, a);
        const matchB = this.calculateMatchScore(currentUser, b);
        return matchB - matchA;
      });
    }

    feedContainer.innerHTML = peers.map(peer => this.createPeerCardHtml(peer, currentUser)).join('');
  },

  calculateMatchScore(me, peer) {
    if (!me || me.isAdmin) return 0;
    let score = 0;
    // He teaches what I want to learn
    const heTeachesWhatILearn = (peer.skillsTeach || []).some(st => 
      (me.skillsLearn || []).some(sl => sl.toLowerCase() === st.toLowerCase())
    );
    // I teach what he wants to learn
    const iTeachWhatHeLearns = (me.skillsTeach || []).some(st => 
      (peer.skillsLearn || []).some(sl => sl.toLowerCase() === st.toLowerCase())
    );

    if (heTeachesWhatILearn && iTeachWhatHeLearns) score += 3; // Perfect 2-way barter!
    else if (heTeachesWhatILearn || iTeachWhatHeLearns) score += 1;

    return score;
  },

  createPeerCardHtml(peer, currentUser) {
    const initials = peer.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    const ratingDisplay = peer.rating ? peer.rating.toFixed(1) : 'New';
    const ratingCount = peer.totalRatings || 0;

    // Match badge logic
    let matchBadgeHtml = '';
    if (currentUser && !currentUser.isAdmin) {
      const matchScore = this.calculateMatchScore(currentUser, peer);
      if (matchScore >= 3) {
        matchBadgeHtml = `
          <div class="match-indicator match-perfect" title="Complementary Match: You teach what they want, and they teach what you want!">
            <span class="match-icon">🔄</span> Perfect Barter Match
          </div>
        `;
      } else if (matchScore >= 1) {
        matchBadgeHtml = `
          <div class="match-indicator match-partial">
            <span class="match-icon">✨</span> Complementary Skill
          </div>
        `;
      }
    }

    return `
      <div class="peer-card ${matchBadgeHtml ? 'card-highlighted' : ''}" id="peerCard_${peer.id}">
        ${matchBadgeHtml}
        <div class="peer-card-header">
          <div class="peer-avatar" style="background-color: ${peer.avatarColor || '#6366f1'}">
            ${initials}
          </div>
          <div class="peer-header-info">
            <h3 class="peer-name">${peer.name}</h3>
            <p class="peer-meta">${peer.college}</p>
            <p class="peer-submeta">${peer.branch} • ${peer.year}</p>
          </div>
          <div class="peer-rating-badge" title="${ratingCount} verified peer reviews">
            <span class="star-icon">★</span>
            <span class="rating-value">${ratingDisplay}</span>
            <span class="rating-count">(${ratingCount})</span>
          </div>
        </div>

        <div class="peer-card-body">
          <p class="peer-bio">${peer.bio || 'Campus peer ready to exchange skills and collaborate.'}</p>
          
          <div class="skills-block">
            <div class="skills-section-label">
              <span class="skill-dot dot-teach"></span> Can Teach:
            </div>
            <div class="skill-tags">
              ${(peer.skillsTeach || []).map(skill => `<span class="skill-tag tag-teach">${skill}</span>`).join('')}
            </div>
          </div>

          <div class="skills-block">
            <div class="skills-section-label">
              <span class="skill-dot dot-learn"></span> Wants to Learn:
            </div>
            <div class="skill-tags">
              ${(peer.skillsLearn || []).map(skill => `<span class="skill-tag tag-learn">${skill}</span>`).join('')}
            </div>
          </div>

          <div class="availability-info">
            <span class="clock-icon">🕒</span> 
            <span>${peer.availability || 'Flexible on campus'}</span>
          </div>
        </div>

        <div class="peer-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="PeerPathDiscovery.openPeerDetailsModal('${peer.id}')">
            View Profile
          </button>
          <button class="btn btn-primary btn-sm" onclick="PeerPathSessions.openRequestModal('${peer.id}')">
            Request Session
          </button>
        </div>
      </div>
    `;
  },

  openPeerDetailsModal(peerId) {
    const peer = PeerPathData.getUserById(peerId);
    if (!peer) return;

    const modal = document.getElementById('peerDetailsModal');
    if (!modal) return;

    const initials = peer.name.split(' ').map(n => n[0]).join('').slice(0, 2);

    document.getElementById('modalPeerAvatar').style.backgroundColor = peer.avatarColor || '#6366f1';
    document.getElementById('modalPeerAvatar').textContent = initials;
    document.getElementById('modalPeerName').textContent = peer.name;
    document.getElementById('modalPeerCollege').textContent = peer.college;
    document.getElementById('modalPeerBranchYear').textContent = `${peer.branch} • ${peer.year} (Roll: ${peer.rollNumber || 'Enrolled Student'})`;
    document.getElementById('modalPeerBio').textContent = peer.bio || 'No bio provided.';
    document.getElementById('modalPeerRating').textContent = `★ ${peer.rating ? peer.rating.toFixed(1) : 'New'} (${peer.totalRatings || 0} reviews)`;
    document.getElementById('modalPeerAvailability').textContent = peer.availability || 'Flexible schedule';

    // Render skills
    const teachContainer = document.getElementById('modalPeerSkillsTeach');
    teachContainer.innerHTML = (peer.skillsTeach || []).map(s => `<span class="skill-tag tag-teach">${s}</span>`).join('');

    const learnContainer = document.getElementById('modalPeerSkillsLearn');
    learnContainer.innerHTML = (peer.skillsLearn || []).map(s => `<span class="skill-tag tag-learn">${s}</span>`).join('');

    // Set request button action in modal
    const reqBtn = document.getElementById('modalPeerRequestBtn');
    if (reqBtn) {
      const currentUser = PeerPathData.getActiveUser();
      const isSelf = currentUser && (
        String(currentUser.id) === String(peer.id) ||
        (currentUser.email && peer.email && currentUser.email.toLowerCase().trim() === peer.email.toLowerCase().trim()) ||
        (currentUser.name && peer.name && currentUser.name.toLowerCase().trim() === peer.name.toLowerCase().trim())
      );
      if (isSelf || (currentUser && currentUser.isAdmin)) {
        reqBtn.style.display = 'none';
      } else {
        reqBtn.style.display = 'inline-block';
        reqBtn.onclick = () => {
          PeerPathDiscovery.closePeerDetailsModal();
          PeerPathSessions.openRequestModal(peer.id);
        };
      }
    }

    modal.classList.add('active');
  },

  closePeerDetailsModal() {
    const modal = document.getElementById('peerDetailsModal');
    if (modal) modal.classList.remove('active');
  }
};

window.PeerPathDiscovery = PeerPathDiscovery;
