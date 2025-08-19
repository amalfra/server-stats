const {
  app, BrowserWindow, ipcMain, dialog,
} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

const { SSHConnection } = require('./lib/SSHConnection');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
let win;

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
  return null;
}

function createWindow() {
  // Create the browser window
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Emitted when the window is closed
  win.on('closed', () => {
    // Dereference the window object, this is the time when you should
    // delete the corresponding element
    win = null;
  });

  ipcMain.handle('start-ssh', async (event, sshConfig) => SSHConnection
    .establish(sshConfig.host, sshConfig.user, sshConfig.key, sshConfig.passphrase));
  ipcMain.handle('execute-ssh', async (event, cmd) => SSHConnection.exec(cmd));
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('readFile', async (event, file) => fs.readFileSync(file, 'utf8'));
}

ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
