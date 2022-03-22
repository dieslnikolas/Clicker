import { BrowserWindow } from 'electron';

import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

/**
 * Builder for creating app window
 */
export class WindowBuilder {

    /**
     * @returns Returns instance of the window
     */
    static getWindow() {
        return WindowBuilder.win;
    }

    /**
     * Main window
     */
    private static win: BrowserWindow = null;

    /**
     * 
     * @returns Arguments which were used to run application
     */
    private static getArguments() {
        // Arguments
        return process.argv.slice(1).some(val => val === '--serve');
    }

    /**
     * Creates app shel
     * @returns Window shell
     */
    public static createWindow(): BrowserWindow {

        // arguments
        let args = WindowBuilder.getArguments();

        // Dont want to recreate window each time 
        if (WindowBuilder.win != null) {
            return WindowBuilder.win;
        }

        // Create the browser window.
        WindowBuilder.win = new BrowserWindow({
            x: 0,
            y: 0,
            width: 1024,
            height: 768,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: (args) ? true : false,
                contextIsolation: false,  // false if you want to run e2e test with Spectron
                enableRemoteModule: true, // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
                devTools: true,
            },
        });

        // Hosted via ng serve
        if (args) {
            WindowBuilder.win.webContents.openDevTools();

            // auto reloads shell when changes in electron are made
            require('electron-reload')(__dirname, {
                // need to re-require electron
                electron: require(path.join(__dirname, '/../node_modules/electron'))
            });

            // url with hosted app
            WindowBuilder.win.loadURL('http://localhost:4200');
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
            WindowBuilder.win.loadURL(url.format({
                pathname: path.join(__dirname, pathIndex),
                protocol: 'file:',
                slashes: true
            }));
        }

        // Emitted when the window is closed.
        WindowBuilder.win.on('closed', () => {
            // Dereference the window object, usually you would store window
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            WindowBuilder.win = null;
        });

        // Custom FRAME
        CreateFrame(WindowBuilder.win);

        // returns window
        return WindowBuilder.win;
    }
}

/**
 * Custom JS Frame
 */
function CreateFrame(win: BrowserWindow) {
    // THIS IS IN ANGULAR
}
