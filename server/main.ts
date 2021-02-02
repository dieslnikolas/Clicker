import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'

/**
 * Electron aplication main class
 */
export class Application {

  /** Browser wimdows wrapper */
  win: BrowserWindow;

  /**
   * Init our electron application
   */
  public Init(): void {

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
   * Finaly creates a window wrapper around application
   */
  private CreateWindow(): void {

    // creates small window
    this.win = new BrowserWindow({ width: 800, height: 600 })

    // loads page and make wraper around it
    this.win.loadURL(
      url.format({
        pathname: path.join(__dirname, '/../client/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )

    // if environment is devel, then it will enable dev tools 
    this.win.webContents.openDevTools();

    // event on window closing
    this.win.on('closed', () => {
      this.win = null
    })
  }
}

// Starts application
var clicker = new Application();
clicker.Init();