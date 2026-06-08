const ChatFlow = {
  container: null,
  input: null,
  btnSend: null,
  btnStrike: null,
  targetInput: null,
  
  config: {
    targetUrl: '',
    companyName: '',
    revenue: '',
    pii: '',
    industry: '',
    compliance: [],
    aiUsage: ''
  },
  
  step: 0,
  
  init: function() {
    this.container = document.getElementById('chat-container');
    this.input = document.getElementById('chat-input');
    this.btnSend = document.getElementById('btn-chat-send');
    this.btnStrike = document.getElementById('btn-strike');
    this.targetInput = document.getElementById('target-url');
    
    // Bind events
    this.btnSend.addEventListener('click', () => this.handleUserSubmit());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleUserSubmit();
    });
    
    // Hook up the strike button
    this.btnStrike.addEventListener('click', () => {
      // Transition setup -> War Room!
      this.initiateStrike();
    });
    
    // Start flow
    setTimeout(() => {
      const modeLabel = (window.AppState && window.AppState.mode === 'live') ? 'Live Mode' : 'Demo Mode';
      this.addAssistantMessage(`Welcome to SOVA — running in <strong>${modeLabel}</strong>. Paste a target agent URI to begin, or ask me anything about the audit process.`);

      setTimeout(() => {
        this.addAssistantMessage("I can help you understand compliance requirements, analyze previous audit results, or configure your strike parameters.");
      }, 1000);
    }, 500);
  },
  
  addAssistantMessage: function(msg, options = []) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble assistant';
    bubble.innerHTML = msg;
    
    // Add quick options if any
    if (options.length > 0) {
      const optsDiv = document.createElement('div');
      optsDiv.className = 'chat-options';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-btn';
        btn.textContent = opt;
        btn.onclick = () => {
          this.input.value = opt;
          if (this.step === 4) { // multi-select compliance
            btn.classList.toggle('selected');
          } else {
            this.handleUserSubmit();
          }
        };
        optsDiv.appendChild(btn);
      });
      bubble.appendChild(optsDiv);
      
      // Add a 'Continue' button for multi-select
      if (this.step === 4) {
        const contBtn = document.createElement('button');
        contBtn.className = 'btn-primary';
        contBtn.style.marginTop = '12px';
        contBtn.style.padding = '8px 16px';
        contBtn.textContent = 'Continue';
        contBtn.onclick = () => {
          const selected = Array.from(optsDiv.querySelectorAll('.chat-btn.selected')).map(b => b.textContent);
          this.input.value = selected.join(', ');
          this.handleUserSubmit();
        };
        bubble.appendChild(contBtn);
      }
    }
    
    this.container.appendChild(bubble);
    this.scrollToBottom();
  },
  
  addUserMessage: function(msg) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = msg;
    this.container.appendChild(bubble);
    this.scrollToBottom();
  },
  
  scrollToBottom: function() {
    this.container.scrollTop = this.container.scrollHeight;
  },
  
  handleUserSubmit: function() {
    const text = this.input.value.trim();
    if (!text && this.step !== 4) return;
    
    if (text) this.addUserMessage(text);
    this.input.value = '';
    
    // Simple state machine for the conversation
    setTimeout(() => {
      switch (this.step) {
        case 0:
          // Waiting for URL
          this.config.targetUrl = this.targetInput.value || text;
          this.addAssistantMessage(`Target identified: <strong>${this.config.targetUrl}</strong><br>Detected: Web application (HTML/JS)<br>I'll need some context about the organization to calibrate the actuarial model. What's the name of the company or product?`);
          this.step++;
          break;
          
        case 1:
          this.config.companyName = text;
          this.addAssistantMessage("What's the approximate annual revenue?", ["<$1M", "$1-10M", "$10-50M", "$50-250M", "$250M+"]);
          this.step++;
          break;
          
        case 2:
          this.config.revenue = text;
          this.addAssistantMessage("How many PII (personally identifiable) records does the system store?", ["<1K", "1K-100K", "100K-1M", "1M-10M", "10M+"]);
          this.step++;
          break;
          
        case 3:
          this.config.pii = text;
          this.addAssistantMessage("What industry sector?", ["Finance", "Healthcare", "E-commerce", "SaaS", "Other"]);
          this.step++;
          break;
          
        case 4:
          this.config.industry = text;
          this.addAssistantMessage("Which compliance frameworks apply? (Select all that apply)", ["GDPR", "SOC2", "PCI-DSS", "HIPAA", "CCPA", "ISO27001"]);
          this.step++;
          break;
          
        case 5:
          this.config.compliance = text.split(', ');
          this.addAssistantMessage("Does this system use AI or LLM models?", ["Yes", "No"]);
          this.step++;
          break;
          
        case 6:
          this.config.aiUsage = text;
          
          let summary = `✓ Configuration complete.<br><br>
            Target: ${this.config.targetUrl}<br>
            Company: ${this.config.companyName}<br>
            Revenue: ${this.config.revenue} | PII: ${this.config.pii} | Industry: ${this.config.industry}<br>
            AI/LLM: ${this.config.aiUsage}<br><br>
            Strike parameters calibrated. Ready when you are.`;
            
          this.addAssistantMessage(summary);
          this.btnStrike.disabled = false;
          this.step++;
          break;
      }
    }, 600);
  },
  
  initiateStrike: function() {
    // Notify Main process to begin execution and go to war room.
    AppState.go('warroom');

    // Clear terminals just in case
    if (window.TerminalMgr) window.TerminalMgr.clearAll();

    // Stash chosen mode into the audit config
    const mode = (window.AppState && window.AppState.mode) || 'demo';
    const auditConfig = Object.assign({}, this.config, { mode });

    // Start IPC call to the engine
    if (window.truscore) {
      window.truscore.startAudit(auditConfig).then(result => {
        window.finalizeAudit(result);
      }).catch(err => {
        console.error("Audit threw an error", err);
      });
    } else {
      console.warn('IPC bridge window.truscore not found - running in browser for dev mode?');
      setTimeout(() => {
        if (window.TerminalMgr) {
          window.TerminalMgr.route({ terminal: 'alpha', type: 'LEAK', message: 'IPC bridge not found. Mock strike running.' });
        }
        document.getElementById('live-score').textContent = '650';
        setTimeout(() => window.finalizeAudit({ score: 650 }), 3000);
      }, 1000);
    }
  }
};

window.ChatFlow = ChatFlow;
