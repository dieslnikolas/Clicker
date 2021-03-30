import { app, BrowserWindow } from 'electron'
import * as url from 'url'
import * as path from 'path'
import { Settings } from '../tools/settings';
import { TrayManager } from './tray';

/**
 * Finaly creates a window wrapper around application
 */
export class Shell {

    /** Browser wimdows wrapper */
    static win: BrowserWindow;

    /**
     * Creates shell for web apliaction
     */
    static createShell() {

        // if there is no window, it will recreate (MACOS FIX - where MINIMALIZE DONT EXISTS!)
        if (this.win != null) return;

        // creates small window
        this.win = new BrowserWindow({
            width: 1200, height: 900, webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                enableRemoteModule: true
            }
        })

        // inject web application
        // **production 
        if (Settings.isProduction) {
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
            'activate': false,
            'mode': 'bottom'
        });

        // event on window closing
        this.win.on('closed', (event) => {
            this.win = null;
        });

        // TRAY
        let tray = null;
        this.win.on('minimize', function (event) {
            event.preventDefault();
            this.hide();
            tray = TrayManager.create(this);
        });

        this.win.on('restore', function () {
            this.show();
            tray.destroy();
        });
    }
}