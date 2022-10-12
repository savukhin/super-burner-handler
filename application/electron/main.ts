import { app, BrowserWindow } from 'electron';
// const { app, BrowserWindow } = require('electron')
import * as path from 'path';
import * as url from 'url';
// const path = require('path');
// const url = require('url');

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // mainWindow.loadURL(
  //   url.format({
  //       // pathname: path.join(__dirname, '../dist/renderer/index.html'),
  //       pathname: path.join(__dirname, '../index.html'),
  //       protocol: 'file:',
  //       slashes: true
  //   })
  // );
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
}

app.on('ready', createWindow);
// app.allowRendererProcessReuse = true;
