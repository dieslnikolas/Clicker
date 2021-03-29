import { app } from 'electron'
import { Shell } from "electron/common/shell";
import { Settings } from "electron/tools/settings";

/**
 * Electron aplication main class
 */
export class Application {

    /**
     * Init our electron application
     */
    public init(): void {

        // 1) READ SETTINGS
        (new Settings()).init();

        // 2) PREPARE IPC's
        // TODO: IPC registration

        // 3) CREATE WINDOW
        // when electron is ready, then we can create window
        app.on('ready', () => (new Shell()).createShell())

        // this is mac-only special function, because on MacOS app can have killed all windows but still running
        // this will ensure that new window is spawned when there is none left
        app.on('activate', () => (new Shell()).createShell());
    }
}

// Starts application
(new Application()).init();