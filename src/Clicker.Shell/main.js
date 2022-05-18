"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var logger_1 = require("./common/logger");
var window_1 = require("./window");
var menubar_1 = require("./menubar");
// Initialize remote module
require('@electron/remote/main').initialize();
// disable warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Browser window is global to not create another instances
var win = null;
var logger = new logger_1.Logger(); // init logging
// Run application
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () { return setTimeout(function () { window_1.WindowBuilder.createWindow(); }, 400); });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    // Activated window
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (window_1.WindowBuilder.getWindow() === null) {
            // Creates window
            window_1.WindowBuilder.createWindow();
            // Creates menubar
            menubar_1.MenuBarBuilder.createMenu();
        }
    });
}
catch (e) {
    logger.write(e);
}
//# sourceMappingURL=main.js.map