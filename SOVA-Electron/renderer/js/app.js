// App state management
const AppState = {
  current: 'splash',
  history: [],
  mode: 'demo', // 'demo' or 'live' — picked on splash

  setMode: function(mode) {
    this.mode = mode;
    document.body.classList.remove('mode-demo', 'mode-live');
    document.body.classList.add('mode-' + mode);
  },

  // Transition to a new state view
  go: function(newState) {
    if (newState === this.current) return;

    // Hide current
    const currentEl = document.getElementById(this.current);
    if (currentEl) {
      currentEl.classList.remove('active');
      setTimeout(() => {
        currentEl.style.display = 'none';
      }, 400); // match css transition time
    }

    // Setup and show new
    const newEl = document.getElementById(newState);
    if (newEl) {
      newEl.style.display = 'flex';
      // Force reflow
      void newEl.offsetWidth;
      newEl.classList.add('active');
    }

    // Update history and title bar
    this.history.push(this.current);
    this.current = newState;
    this.updateTitlebar();
  },

  // Update the titlebar badge based on current state
  updateTitlebar: function() {
    const badge = document.getElementById('status-badge');
    const backBtn = document.getElementById('back-btn');

    badge.className = 'active'; // Reset

    if (this.current === 'splash') {
      badge.style.display = 'none';
      backBtn.classList.remove('visible');
    } else if (this.current === 'console') {
      badge.style.display = 'flex';
      badge.textContent = this.mode === 'live' ? '● LIVE MODE — CONSOLE' : '● DEMO MODE — CONSOLE';
      backBtn.classList.remove('visible');
    } else if (this.current === 'warroom') {
      badge.style.display = 'flex';
      badge.className = 'active strike';
      badge.textContent = this.mode === 'live' ? '● LIVE STRIKE IN PROGRESS' : '● STRIKE IN PROGRESS';
      backBtn.classList.add('visible');
    } else if (this.current === 'results') {
      badge.style.display = 'flex';
      badge.className = 'active complete';
      badge.textContent = '● AUDIT COMPLETE';
      backBtn.classList.add('visible');
    }
  }
};

window.AppState = AppState;

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {

  // ────── Splash: mode toggle + Continue button ──────
  const btnDemo = document.getElementById('btn-demo-mode');
  const btnLive = document.getElementById('btn-live-mode');
  const btnContinue = document.getElementById('btn-continue');

  // Default mode class on load
  AppState.setMode(AppState.mode);

  if (btnDemo && btnLive) {
    btnDemo.onclick = () => {
      AppState.setMode('demo');
      btnDemo.classList.add('active');
      btnLive.classList.remove('active');
    };
    btnLive.onclick = () => {
      AppState.setMode('live');
      btnLive.classList.add('active');
      btnDemo.classList.remove('active');
    };
  }

  if (btnContinue) {
    btnContinue.onclick = () => {
      AppState.go('console');
      if (window.ChatFlow) {
        window.ChatFlow.init();
      }
    };
  }

  // Back button functionality
  document.getElementById('back-btn').addEventListener('click', () => {
    if (AppState.current === 'warroom' || AppState.current === 'results') {
      AppState.go('console');
      if (window.truscore) {
        window.truscore.removeAllListeners(); // stop any active IPC loops
      }
    }
  });

  // Handle IPC phase change for splash/setup messaging
  if (window.truscore) {
    window.truscore.onPhaseChange((data) => {
      if (AppState.current === 'splash' && data.message) {
        const status = document.getElementById('splash-status');
        if (status) status.textContent = data.message;
      }
      // Worker status header updates (BOOTING / EXECUTING / DONE / OFFLINE etc.)
      if (data && data.worker && data.status && window.TerminalMgr) {
        window.TerminalMgr.setStatus(data.worker, data.status);
      }
    });

    window.truscore.onAttackEvent((data) => {
      if (window.TerminalMgr) {
        window.TerminalMgr.route(data);
      }
    });

    window.truscore.onScoreUpdate((data) => {
       if (window.ScoreSystem) {
         window.ScoreSystem.updateLiveScore(data.score);
       }
    });

    window.truscore.onMetricUpdate((data) => {
       if (window.LiabilityChart) {
         window.LiabilityChart.updateCategory(data.category, data.points);
       }
    });

    window.truscore.onPenaltyEvent((data) => {
       if (window.PenaltyFeed) {
         window.PenaltyFeed.addPenalty(data.description, data.deduction, data.isCritical, data.worker);
       }
    });
  }
});
