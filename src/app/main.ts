import { app, BrowserWindow } from 'electron';
import { Logger } from './common/logger';
import { WindowBuilder } from './window';
import { MenuBarBuilder } from './menubar';


// Initialize remote module
require('@electron/remote/main').initialize();

// disable warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Browser window is global to not create another instances
let win: BrowserWindow = null;

// Run application
try {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => setTimeout(() => { WindowBuilder.createWindow(); }, 400));

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
        if (WindowBuilder.getWindow() === null) {

            // Creates window
            WindowBuilder.createWindow();

            // Creates menubar
            MenuBarBuilder.createMenu();
        }
    });

} catch (e) {
    Logger.catch(e);
}