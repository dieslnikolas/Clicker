import { app, BrowserWindow, Menu, Tray } from 'electron'
import * as path from 'path'

export class TrayManager {

    /**
     *  Creates and handle Tray icon and behaviour
     */
    static create(window: BrowserWindow) {
 
        let appIcon = new Tray(path.join(__dirname, './../../client/assets/logo.png'));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show', click: function () {
                    window.show();
                }
            },
            {
                label: 'Exit', click: function () {
                    app.quit();
                }
            }
        ]);

        appIcon.on('double-click', function (event) { window.show(); });

        appIcon.setToolTip('Clicker');
        appIcon.setContextMenu(contextMenu);
        return appIcon;
    }
}