import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'

/**
 * Electron aplication main class
 */
export class Application {

    /** Browser wimdows wrapper */
    private win: BrowserWindow;

    /** If its production or development build */
    private isProduction?: boolean;

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
        this.win = new BrowserWindow({ width: 1200, height: 900, webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true
        } })

        // inject web application
        // **production 
        if (this.isProduction) {
            this.win.loadURL(
                url.format({
                    pathname: path.join(__dirname, '/../index.html'),
                    protocol: 'file:',
                    slashes: true,
                })
            )
        }

        // **devel
        // because i realy like ng serve :)
        else {
            this.win.loadURL('http://localhost:4200');
        }

        // if environment is devel, then it will enable dev tools 
        this.win.webContents.openDevTools({
            'mode': 'right',
            'activate': false
        });

        // event on window closing
        this.win.on('closed', () => {
            this.win = null
        })
    }
}

// Starts application
(new Application()).Init();