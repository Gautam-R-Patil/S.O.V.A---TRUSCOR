// Handles the visual updates for the score gauge

class ScoreGauge {
  constructor(total = 850) {
    this.total = total;
    this.arc = document.getElementById('gauge-arc');
    this.miniArc = document.getElementById('mini-gauge-arc');
    this.scoreVal = document.getElementById('final-score');
    this.liveScoreVal = document.getElementById('live-score');
    this.riskLabel = document.getElementById('risk-label');

    if (this.arc) {
      const radius = 150;
      this.circumference = Math.PI * radius;
      this.arc.style.strokeDasharray = `${this.circumference}`;
      this.arc.style.strokeDashoffset = `0`;
    }

    if (this.miniArc) {
      const r = 80;
      this.miniCircumference = Math.PI * r;
      this.miniArc.style.strokeDasharray = `${this.miniCircumference}`;
      // Start at full (score = 850 means 0 offset)
      this.miniArc.style.strokeDashoffset = `0`;
    }
  }

  // Update the War Room live score
  updateLiveScore(score) {
    if (this.liveScoreVal) {
      this.animateValue(this.liveScoreVal, parseInt(this.liveScoreVal.textContent) || 850, score, 500);
      this.liveScoreVal.style.transform = 'scale(1.1)';
      setTimeout(() => { this.liveScoreVal.style.transform = 'scale(1)'; }, 150);
    }

    if (this.miniArc) {
      const safe = Math.max(0, Math.min(this.total, score));
      const offset = this.miniCircumference - (safe / this.total) * this.miniCircumference;
      this.miniArc.style.strokeDashoffset = offset;
    }
  }

  // Update the Results gauge
  setFinalScore(score) {
    if (!this.arc || !this.scoreVal) return;
    
    // ensure within range
    const safeScore = Math.max(0, Math.min(this.total, score));
    
    // The offset represents the empty part.
    // If score is 850 (100%), offset is 0.
    // If score is 0 (0%), offset is circumference.
    const percentage = safeScore / this.total;
    const offset = this.circumference - (percentage * this.circumference);
    
    // Trigger CSS transition
    setTimeout(() => {
      this.arc.style.strokeDashoffset = offset;
    }, 100); // slight delay for visual pop
    
    // Animate the numbers
    this.animateValue(this.scoreVal, 0, safeScore, 1500);
    
    // Update risk label
    if (this.riskLabel) {
      this.riskLabel.className = 'risk-label';
      if (safeScore >= 750) {
        this.riskLabel.textContent = 'SECURE / LOW RISK';
        this.riskLabel.classList.add('secure');
      } else if (safeScore >= 600) {
        this.riskLabel.textContent = 'MODERATE RISK';
        this.riskLabel.classList.add('moderate');
      } else if (safeScore >= 400) {
        this.riskLabel.textContent = 'HIGH LIABILITY';
        this.riskLabel.classList.add('high');
      } else {
        this.riskLabel.textContent = 'CRITICAL VULNERABILITY';
        this.riskLabel.classList.add('critical');
      }
    }
  }
  
  // Helper to animate numbers rolling up
  animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end; // Ensure exact final value
      }
    };
    window.requestAnimationFrame(step);
  }
}

// Global instance 
window.ScoreSystem = new ScoreGauge();
