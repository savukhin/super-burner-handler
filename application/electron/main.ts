import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
// const serialport = require("serialport")
// import { SerialPort } from 'electron';
import { SerialPort } from 'serialport';
let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:4000`);
  } else {
    mainWindow.loadURL(
      url.format({
          pathname: path.join(__dirname, 'renderer/index.html'),
          protocol: 'file:',
          slashes: true
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools()
}

async function handleSetTitle (event: Electron.IpcMainInvokeEvent, title: string) {
  return (await SerialPort.list()).map(port => port.path)
}


app.on('ready', () => {
  ipcMain.handle("set-title", handleSetTitle)

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
