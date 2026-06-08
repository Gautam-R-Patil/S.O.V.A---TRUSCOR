const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('truscore', {
  startAudit: (config) => ipcRenderer.invoke('start-audit', config),
  
  onAttackEvent: (cb) => ipcRenderer.on('attack-event', (e, data) => cb(data)),
  onScoreUpdate: (cb) => ipcRenderer.on('score-update', (e, data) => cb(data)),
  onMetricUpdate: (cb) => ipcRenderer.on('metric-update', (e, data) => cb(data)),
  onPenaltyEvent: (cb) => ipcRenderer.on('penalty-event', (e, data) => cb(data)),
  onPhaseChange: (cb) => ipcRenderer.on('phase-change', (e, data) => cb(data)),
  
  generatePDF: (type) => ipcRenderer.invoke('generate-pdf', type),
  saveFile: (filePath, data) => ipcRenderer.invoke('save-file', filePath, data),
  
  windowControl: (action) => ipcRenderer.send('window-control', action),
  
  // Remove listeners to avoid memory leaks if re-running
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('attack-event');
    ipcRenderer.removeAllListeners('score-update');
    ipcRenderer.removeAllListeners('metric-update');
    ipcRenderer.removeAllListeners('penalty-event');
    ipcRenderer.removeAllListeners('phase-change');
  }
});
