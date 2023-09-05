const { app, BrowserWindow, screen } = require('electron');
const { Menu, MenuItem } = require('electron');
const { ipcMain } = require('electron');
const crypto = require('crypto');

ipcMain.on('enter-game', (event, arg) => {
  event.reply('join-game', arg);
});

const GAMETEST = true;
let win;

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const pos = [
    [width / 2, height / 2],
    [width / 2, 0],
    [0, height / 2],
    [0, 0],
    // [width/4, height/4],

  ];
  if (GAMETEST) {
    for (let i = 0; i < pos.length; i++) {
      const [x, y] = pos[i];
      createWindow(x, y);
    }
  }

  // createMain();

  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: 'ctrl+shift+i',
        click: () => { BrowserWindow.getFocusedWindow().toggleDevTools(); }
      }, {
        label: 'Reload',
        accelerator: 'f5',
        click: () => { BrowserWindow.getFocusedWindow().reload(); }
      },
      {
        label: 'Exit',
        accelerator: 'esc',
        click: () => { app.quit(); }
      },
    ]
  }));

  Menu.setApplicationMenu(menu);

});

function createWindow(x = null, y = null) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width / 2,
    height: height / 2,
    x: x,
    y: y,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      partition: (() => crypto
      .createHash('md5')
      .update(Date.now() + '')
      .digest()
      .toString('hex'))()
    }
  });

  win.loadURL('http://localhost:3000');
}
