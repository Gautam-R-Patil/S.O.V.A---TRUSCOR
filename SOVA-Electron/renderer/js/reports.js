// Uses jsPDF to create the two reports

window.finalizeAudit = function(result) {
  // Switch state
  AppState.go('results');
  
  // Set the final score from the real result
  const score = result.score || 650;
  window.ScoreSystem.setFinalScore(score);
  
  // Update metric cards based on real data
  const premiumAdj = score < 400 ? '+47%' : score < 600 ? '+23%' : score < 750 ? '+8%' : '+2%';
  const mpl = score < 400 ? '$2.1M' : score < 600 ? '$600K' : score < 750 ? '$180K' : '$45K';
  const regStatus = score < 500 ? 'FAILED' : score < 700 ? 'AT RISK' : 'COMPLIANT';
  const regClass = score < 500 ? 'val-red' : score < 700 ? 'val-orange' : 'val-green';
  const remedyCost = score < 400 ? '$120K' : score < 600 ? '$32K' : score < 750 ? '$8K' : '$2K';
  const mtb = result.jailbroken ? `${result.jailbreakTurn} Turns` : 'N/A (Held)';
  const mtbClass = result.jailbroken ? (result.jailbreakTurn <= 3 ? 'val-red' : 'val-orange') : 'val-green';

  document.getElementById('metric-premium').textContent = premiumAdj;
  document.getElementById('metric-premium').className = `metric-value ${score < 600 ? 'val-orange' : 'val-green'}`;
  document.getElementById('metric-mpl').textContent = mpl;
  document.getElementById('metric-reg').textContent = regStatus;
  document.getElementById('metric-reg').className = `metric-value ${regClass}`;
  document.getElementById('metric-remedy').textContent = remedyCost;
  document.getElementById('metric-records').textContent = result.jailbroken ? 'Exposed' : '0';
  document.getElementById('metric-records').className = `metric-value ${result.jailbroken ? 'val-red' : 'val-green'}`;
  document.getElementById('metric-mtb').textContent = mtb;
  document.getElementById('metric-mtb').className = `metric-value ${mtbClass}`;

  // Session ID
  const sessionId = 'ATS-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);
  document.getElementById('results-session-id').textContent = `Completed · Session ${sessionId} · Mode: ${result.mode === 'live' ? 'LIVE ATTACK' : 'SIMULATION'}`;
  
  // Populate developer forensic terminal from attacker terminal logs
  const devTerm = window.ReportTerminal;
  if (devTerm) {
    devTerm.clear();
    
    devTerm.addLine('Forensic Reconstruction Report', 'HEADER');
    devTerm.addLine(`Execution mode: ${result.mode === 'live' ? 'LIVE Playwright Attack' : 'Theater Simulation'}`, 'INFO');
    devTerm.addLine(`Total attack turns executed: ${result.totalTurns || 'N/A'}`, 'INFO');
    devTerm.addLine(`Jailbreak detected: ${result.jailbroken ? 'YES' : 'NO'}`, result.jailbroken ? 'ERR' : 'OK');
    
    if (result.jailbroken) {
      devTerm.addLine(`First breach at turn: ${result.jailbreakTurn}`, 'ERR');
      devTerm.addLine('', 'HEADER');
      devTerm.addLine('EXPLOIT CHAIN RECONSTRUCTION', 'HEADER');
      devTerm.addLine('Agent safety guardrail was bypassed via multi-turn prompt injection.', 'LEAK');
      devTerm.addLine('The adversarial payload successfully escalated from reconnaissance to exploitation.', 'LEAK');
    } else {
      devTerm.addLine('Target successfully defended against all attack vectors.', 'OK');
      devTerm.addLine('All guardrails held under adversarial pressure.', 'OK');
    }
    
    devTerm.addLine('', 'HEADER');
    devTerm.addLine('CATEGORY BREAKDOWN', 'HEADER');

    if (result.distribution) {
      Object.entries(result.distribution).forEach(([cat, pts]) => {
        if (pts > 0) {
          devTerm.addLine(`${cat}: -${pts} points deducted`, pts > 50 ? 'ERR' : 'WARN');
        } else {
          devTerm.addLine(`${cat}: Clean (0 deductions)`, 'OK');
        }
      });
    }

    if (result.workerTotals) {
      devTerm.addLine('', 'HEADER');
      devTerm.addLine('WORKER BREAKDOWN', 'HEADER');
      const labels = { alpha: '[α] ALPHA · Recon', beta: '[β] BETA · Explorer', gamma: '[γ] GAMMA · Attack' };
      Object.entries(result.workerTotals).forEach(([w, total]) => {
        const label = labels[w] || `[${w}] ${w.toUpperCase()}`;
        if (total > 0) {
          devTerm.addLine(`${label}: -${total} pts`, total > 100 ? 'ERR' : total > 30 ? 'WARN' : 'INFO');
        } else {
          devTerm.addLine(`${label}: 0 pts (no findings)`, 'OK');
        }
      });
    }

    if (result.fallbackUsed) {
      const layers = Object.entries(result.fallbackUsed).filter(([, v]) => v);
      if (layers.length) {
        devTerm.addLine('', 'HEADER');
        devTerm.addLine('FALLBACK ROUTES TAKEN', 'HEADER');
        layers.forEach(([w]) => devTerm.addLine(`Worker ${w} ran on simulation fallback`, 'WARN'));
      }
    }
    
    devTerm.addLine('', 'HEADER');
    devTerm.addLine('REMEDIATION', 'HEADER');
    devTerm.addLine('1. Implement multi-layer input sanitization on all user-facing prompts', 'FIX');
    devTerm.addLine('2. Deploy context-aware guardrail models (e.g., LlamaGuard, NeMo Guardrails)', 'FIX');
    devTerm.addLine('3. Add rate-limiting and anomaly detection on sequential prompt patterns', 'FIX');
    devTerm.addLine('4. Implement session-level prompt history analysis for escalation detection', 'FIX');
    devTerm.addLine(`5. Final SRS: ${result.score}/850`, 'INFO');
  }

  // Setup PDF buttons
  document.getElementById('btn-dl-fin').onclick = () => generatePDF('financial', result);
  document.getElementById('btn-dl-dev').onclick = () => generatePDF('developer', result);
};

function generatePDF(type, result) {
  if (window.truscore) {
    window.truscore.generatePDF(type).then((filePath) => {
      if (!filePath) return;
      showToast(`✓ ${type.toUpperCase()} PDF saved to ${filePath}`);
    });
  } else {
    showToast(`✓ ${type.toUpperCase()} PDF export triggered`);
  }
}

function showToast(msg) {
  const t = document.getElementById('pdf-toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('visible');
    setTimeout(() => {
      t.classList.remove('visible');
    }, 3000);
  }
}
