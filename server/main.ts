import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as electronReloader from 'electron-reloader'

/**
 * Electron aplication main class
 */
export class Application {

  /** Browser wimdows wrapper */
  win: BrowserWindow;

  /** If its production or development build */
  isProduction?: boolean;

  /**
   * Init our electron application
   */
  public Init(): void {

    // Auto reload for both renderer and main process
    this.EnableHotReload();

    // when electron is ready, then we can create window
    app.on('ready', this.CreateWindow)

    // this is mac-only special function, because on MacOS app can have killed all windows but still running
    // this will ensure that new window is spawned when there is none left
    app.on('activate', () => {
      if (this.win === null) {
        this.CreateWindow()
      }
    })
  }

  /**
   * Hot-reload for both client and server (angualr and electron)
   */
  private EnableHotReload(): void {

    // The try/catch is needed so it doesn't throw Cannot find module 'electron-reloader' in production.
    try { electronReloader(module); } catch { };

  }

  /**
   * Finaly creates a window wrapper around application
   */
  private CreateWindow(): void {

    // creates small window
    this.win = new BrowserWindow({ width: 800, height: 600 })

    // inject web application
    // **production 
    if (this.isProduction) {
      this.win.loadURL(
        url.format({
          pathname: path.join(__dirname, '/../client/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      )
    }

    // **devel
    else {
      this.win.loadURL('http://localhost:4200');
    }

    // if environment is devel, then it will enable dev tools 
    this.win.webContents.openDevTools({
      'mode': 'bottom',
      'activate': false
    });

    // event on window closing
    this.win.on('closed', () => {
      this.win = null
    })
  }
}

// Starts application
var clicker = new Application();
clicker.Init();