const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  readFile: (path) => ipcRenderer.invoke('readFile', path),
  startSSH: (config) => ipcRenderer.invoke('start-ssh', config),
  execSSH: (cmd) => ipcRenderer.invoke('execute-ssh', cmd),
});
