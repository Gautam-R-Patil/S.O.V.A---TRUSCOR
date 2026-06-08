/* Reusable Terminal Component */
class Terminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lines = [];
    this.maxLines = 200;
  }

  // Type: EXEC (white), LEAK (orange), INFO (blue), OK (green), WARN (yellow), ERR (red)
  // SENSOR (yellow), FIX (purple), HEADER (white bold)
  addLine(message, type = 'EXEC') {
    if (!this.container) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS

    let lineObj = { time: timeStr, type: type, message: message };
    this.lines.push(lineObj);

    if (this.lines.length > this.maxLines) {
      this.lines.shift();
      if (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }

    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';

    if (type === 'HEADER') {
      lineEl.innerHTML = `<span class="t-type t-HEADER"></span><span class="t-HEADER">═══ ${escapeHtml(message)} ═══</span>`;
    } else {
      lineEl.innerHTML = `<span class="t-time">${timeStr}</span><span class="t-type t-${type}">${type}</span><span class="t-msg t-${type}">${escapeHtml(message)}</span>`;
    }

    this.container.appendChild(lineEl);

    // Auto scroll ONLY the container, not the whole page
    this.container.scrollTo({
      top: this.container.scrollHeight,
      behavior: 'smooth'
    });
  }

  clear() {
    this.lines = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ────────── TerminalManager — routes engine events to per-worker panes ────────── */
class TerminalManager {
  constructor() {
    this.terminals = {};
    this.statusEls = {};
  }

  init() {
    // Demo Mode: 3-pane warroom (alpha · beta · gamma)
    this.terminals.alpha  = new Terminal('alpha-terminal');
    this.terminals.beta   = new Terminal('beta-terminal');
    this.terminals.gamma  = new Terminal('gamma-terminal');
    // Live Mode: 2-pane warroom (attacker · victim)
    this.terminals.attacker = new Terminal('attacker-terminal');
    this.terminals.victim   = new Terminal('victim-terminal');
    // Results / forensic
    this.terminals.report = new Terminal('report-terminal');

    this.statusEls.alpha    = document.getElementById('alpha-status');
    this.statusEls.beta     = document.getElementById('beta-status');
    this.statusEls.gamma    = document.getElementById('gamma-status');
    this.statusEls.attacker = document.getElementById('attacker-status');
    this.statusEls.victim   = document.getElementById('victim-status');
  }

  route(event) {
    if (!event) return;
    const key = (event.terminal || 'attacker').toLowerCase();
    const t = this.terminals[key] || this.terminals.attacker;
    if (event.type === 'STATUS' && this.statusEls[key]) {
      this.statusEls[key].textContent = event.message || '● IDLE';
      return;
    }
    t.addLine(event.message, event.type || 'EXEC');
  }

  setStatus(worker, label) {
    const el = this.statusEls[worker];
    if (el) el.textContent = label;
  }

  clearAll() {
    for (const t of Object.values(this.terminals)) {
      if (t && typeof t.clear === 'function') t.clear();
    }
  }
}

// Global references — kept for backward-compat with older code paths
window.AttackerTerminal = null;
window.VictimTerminal = null;
window.ReportTerminal = null;
window.TerminalMgr = null;

function initTerminals() {
  window.TerminalMgr = new TerminalManager();
  window.TerminalMgr.init();

  window.AttackerTerminal = window.TerminalMgr.terminals.attacker;
  window.VictimTerminal   = window.TerminalMgr.terminals.victim;
  window.ReportTerminal   = window.TerminalMgr.terminals.report;
}

document.addEventListener('DOMContentLoaded', initTerminals);
