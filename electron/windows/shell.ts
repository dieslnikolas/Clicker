import { BrowserWindow } from "electron";
import * as path from "path";

// This is the main window of the application.
export class Shell {

    constructor(private width: number, private height: number, private title: string, private isDev: boolean) {
    }

    // Creates new electron BrowserWindow
    public createWindow(): void {

        // Create the browser window.
        const win = new BrowserWindow({
            width: this.width, // TODO: Get this from package.json
            height: this.height, // TODO: Get this from package.json
            title: this.title, // TODO: Get this from package.json
            center: true,
            webPreferences: {
                nodeIntegration: true, // this does not work with contextIsolation: true
                contextIsolation: false // this is needed for nodeIntegration: true
            }
        });

        // Opens developer tools if in development mode
        win.webContents.openDevTools();

        // Load index page or server
        if (this.isDev) {
            win.loadURL("http://localhost:3000/index.html");
        } else {
            win.loadURL(`file://${path.join(__dirname, "/../build/index.html")}`);
        }
    }

}