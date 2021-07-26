import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

// Initialize remote module
require('@electron/remote/main').initialize();

// Browser window is global to not create another instances
let win: BrowserWindow = null;

// Arguments
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  // Screen
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule: true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  // Hosted via ng serve
  if (serve) {
    win.webContents.openDevTools();

    // auto reloads shell when changes in electron are made
    require('electron-reload')(__dirname, {
      // need to re-require electron
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });

    // url with hosted app
    win.loadURL('http://localhost:4200');
  } 
  
  // Packed inside electron shell 
  else {
    // Path when running electron executable
    let pathIndex = './index.html';

    // Path when running electron in local folder
    if (fs.existsSync(path.join(__dirname, '../../dist/index.html'))) {
      pathIndex = '../../dist/index.html';
    }

    // open file
    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // returns window
  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Activated window
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
  // TODO: Global errors handle
}
