import { app, BrowserWindow, Menu } from 'electron/main';
import { shell } from 'electron/common';
import path from 'node:path';
import isDev from 'electron-is-dev';

const isMac = process.platform === 'darwin';

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
            },
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      // { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' },
          ]
        : [{ role: 'close' }]),
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://electronjs.org');
        },
      },
    ],
  },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

function createWindow() {
  const devPath = path.join(__dirname, 'preload.js');
  const prodPath = path.join(process.resourcesPath, 'preload.js');

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: isDev ? devPath : prodPath,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    const indexPath = path.join(process.resourcesPath, 'dist', 'index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
