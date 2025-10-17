const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    const valid = ['toMain'];
    if (valid.includes(channel)) ipcRenderer.send(channel, data);
  },
  on: (channel, cb) => {
    const valid = ['fromMain'];
    if (valid.includes(channel))
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
  },
});

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('editable');
  textarea.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    ipcRenderer.send('context-menu');
  });
});
