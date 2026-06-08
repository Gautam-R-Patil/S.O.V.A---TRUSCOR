// Handles the mathematical charting & penalty feed in War Room state

const LiabilityChart = {
  container: null,
  bars: [],
  maxPenalty: 100, // starting scale
  
  init: function() {
    this.container = document.querySelector('.liability-chart');
    if (!this.container) return;
    
    this.container.innerHTML = ''; // reset
    
    // Create 6 categories
    const categories = ['AUTH', 'DB', 'LOGIC', 'PII', 'RCE', 'DOS'];
    
    categories.forEach(cat => {
      const col = document.createElement('div');
      col.className = 'bar-container';
      
      const val = document.createElement('div');
      val.className = 'bar-val';
      val.textContent = '0';
      
      const track = document.createElement('div');
      track.className = 'bar-track';
      
      const fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.height = '0%';
      
      const label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = cat;
      
      track.appendChild(fill);
      col.appendChild(val);
      col.appendChild(track);
      col.appendChild(label);
      
      this.container.appendChild(col);
      
      this.bars.push({ cat, valEl: val, fillEl: fill, currentVal: 0 });
    });
  },
  
  updateCategory: function(cat, points) {
    const barData = this.bars.find(b => b.cat === cat);
    if (!barData) return;
    
    barData.currentVal += points;
    
    // Adjust max scale if needed
    if (barData.currentVal > this.maxPenalty) {
      this.maxPenalty = barData.currentVal * 1.5;
      this.recalculateAll();
    } else {
      this.renderBar(barData);
    }
  },
  
  renderBar: function(barData) {
    const pct = Math.min(100, (barData.currentVal / this.maxPenalty) * 100);
    barData.fillEl.style.height = `${pct}%`;
    barData.valEl.textContent = barData.currentVal;
    
    if (barData.currentVal > 50) {
      barData.fillEl.style.background = 'var(--status-red)';
    } else if (barData.currentVal > 20) {
      barData.fillEl.style.background = 'var(--accent)';
    }
  },
  
  recalculateAll: function() {
    this.bars.forEach(b => this.renderBar(b));
  }
};

const PenaltyFeed = {
  container: null,
  
  init: function() {
    this.container = document.getElementById('penalty-feed');
    if (this.container) this.container.innerHTML = '';
  },
  
  addPenalty: function(desc, points, isCritical = false, worker = null) {
    if (!this.container) return;

    const maxPoints = 200; // Visual scale for the mini bar
    const pct = Math.min(100, (points / maxPoints) * 100);
    const critClass = isCritical ? 'critical' : '';

    const workerKey = (worker || 'system').toLowerCase();
    const tagMap = { alpha: '[α]', beta: '[β]', gamma: '[γ]', system: '[S]' };
    const tag = tagMap[workerKey] || `[${workerKey[0] || 'S'}]`;
    const safeDesc = String(desc || '').replace(/</g, '&lt;');

    const html = `
      <div class="penalty-item">
        <div class="penalty-header">
          <span><span class="penalty-worker ${workerKey}">${tag}</span> ${safeDesc}</span>
          <span class="penalty-val ${critClass}">-${points}</span>
        </div>
        <div class="p-bar-track">
          <div class="p-bar-fill ${critClass}" style="width: 0%"></div>
        </div>
      </div>
    `;
    
    // Prepend to top
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    const item = temp.firstChild;
    
    // Keep max 5 items
    if (this.container.children.length >= 5) {
      this.container.removeChild(this.container.lastChild);
    }
    
    this.container.insertBefore(item, this.container.firstChild);
    
    // Trigger animation
    setTimeout(() => {
      const fill = item.querySelector('.p-bar-fill');
      if (fill) fill.style.width = `${pct}%`;
    }, 50);
  }
};

window.LiabilityChart = LiabilityChart;
window.PenaltyFeed = PenaltyFeed;

document.addEventListener('DOMContentLoaded', () => {
  LiabilityChart.init();
  PenaltyFeed.init();
});
