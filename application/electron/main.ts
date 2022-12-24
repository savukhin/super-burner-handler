import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { SerialClient } from './SerialClient';

let mainWindow: Electron.BrowserWindow | null;

let serialClient = new SerialClient

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

  // mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null)

}

app.setUserTasks([])

app.on('ready', async () => {
  ipcMain.handle("get-coms", SerialClient.handleGetCOMs)

  ipcMain.handle("send-move",  (event, length, axis) => {
    return serialClient.SendMoveHandler(event, length, axis)
  })
 
  ipcMain.handle("chose-com", (event, portName) => { 
    return serialClient.SetPortHandler(event, portName);   
  })

  ipcMain.handle("calibrate",  (event, length, axis) => {
    return serialClient.SendCalibrateHandler(event)
  })

  ipcMain.handle("show-message-box", (event, msg) => {
    dialog.showMessageBox({ 
      type: "error",
      title: "error",
      message: msg 
    })
  })

  

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
