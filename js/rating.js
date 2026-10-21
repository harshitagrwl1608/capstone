/**
 * PeerPath - Rating & Peer Evaluation Module
 * Implements 1-5 scale rating and running average score calculation
 * as specified in Synopsis Chapter 2.3
 */

const PeerPathRating = {
  activeSessionId: null,
  activePeerId: null,
  selectedScore: 5,

  init() {
    this.setupListeners();
  },

  setupListeners() {
    const stars = document.querySelectorAll('.star-choice');
    stars.forEach(star => {
      star.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.dataset.val, 10);
        this.setStarScore(val);
      });
      star.addEventListener('mouseenter', (e) => {
        const val = parseInt(e.currentTarget.dataset.val, 10);
        this.previewStars(val);
      });
    });

    const starContainer = document.querySelector('.star-choice-container');
    if (starContainer) {
      starContainer.addEventListener('mouseleave', () => {
        this.previewStars(this.selectedScore);
      });
    }

    const form = document.getElementById('ratingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitRating();
      });
    }
  },

  setStarScore(val) {
    this.selectedScore = val;
    this.previewStars(val);

    const labels = {
      1: '1/5 - Needs Improvement',
      2: '2/5 - Fair Session',
      3: '3/5 - Good Knowledge Share',
      4: '4/5 - Very Helpful & Clear',
      5: '5/5 - Exceptional Peer Mentor! 🌟'
    };

    const labelEl = document.getElementById('starScoreLabel');
    if (labelEl) labelEl.textContent = labels[val] || `${val}/5`;
  },

  previewStars(val) {
    const stars = document.querySelectorAll('.star-choice');
    stars.forEach(star => {
      const starVal = parseInt(star.dataset.val, 10);
      if (starVal <= val) {
        star.classList.add('star-selected');
      } else {
        star.classList.remove('star-selected');
      }
    });
  },

  openModal(sessionId, peerId, peerName, skill) {
    this.activeSessionId = sessionId;
    this.activePeerId = peerId;
    this.setStarScore(5);

    document.getElementById('ratingModalPeerName').textContent = peerName;
    document.getElementById('ratingModalSkill').textContent = skill;
    document.getElementById('ratingCommentInput').value = '';

    document.getElementById('ratingModal').classList.add('active');
  },

  closeModal() {
    document.getElementById('ratingModal').classList.remove('active');
    this.activeSessionId = null;
    this.activePeerId = null;
  },

  submitRating() {
    if (!this.activeSessionId || !this.activePeerId) return;

    const currentUser = PeerPathData.getActiveUser();
    const session = PeerPathData.getSessionById(this.activeSessionId);
    const peer = PeerPathData.getUserById(this.activePeerId);

    if (!session || !peer || !currentUser) return;

    const score = this.selectedScore;
    const comment = document.getElementById('ratingCommentInput').value.trim();

    // 1. Update session record
    const isRequester = session.requesterId === currentUser.id;
    if (isRequester) {
      PeerPathData.updateSession(this.activeSessionId, { 
        ratingByRequester: score,
        reviewByRequester: comment || null
      });
    } else {
      PeerPathData.updateSession(this.activeSessionId, { 
        ratingByTarget: score,
        reviewByTarget: comment || null
      });
    }

    // 2. Update peer's running average rating
    const currentRating = peer.rating || 5.0;
    const currentCount = peer.totalRatings || 0;
    const newCount = currentCount + 1;
    const newAverage = ((currentRating * currentCount) + score) / newCount;

    PeerPathData.updateUser(this.activePeerId, {
      rating: parseFloat(newAverage.toFixed(2)),
      totalRatings: newCount
    });

    this.closeModal();

    PeerPathApp.showToast(`Thank you! Your ${score}-star rating for ${peer.name} has been recorded.`, 'success');

    // Refresh displays
    PeerPathSessions.renderSessions();
    PeerPathDiscovery.renderFeed();
  }
};

window.PeerPathRating = PeerPathRating;
