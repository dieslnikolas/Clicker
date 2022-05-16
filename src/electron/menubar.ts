import { app, Menu } from "electron";

/**
 * Class for creating menubar
 */
export class MenuBarBuilder {

    /** If it is running on MacOS */
    private static isMac = process.platform === 'darwin'

    /**
     * Creates initial menu
     */
    public static createMenu() {
        const menu = Menu.buildFromTemplate(MenuBarBuilder.template);
        Menu.setApplicationMenu(menu)
    }

    /** Menu template */
    public static template: any = [

        // APP MENU - avaliable only on MacOS
        ...(MenuBarBuilder.isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                // { type: 'separator' },
                // { role: 'services' },
                // { type: 'separator' },
                // { role: 'hide' },
                // { role: 'hideothers' },
                // { role: 'unhide' },
                // { type: 'separator' },
                { role: 'quit' }
            ]
        }] : [])
    ];
}