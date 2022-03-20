"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBarBuilder = void 0;
var electron_1 = require("electron");
/**
 * Class for creating menubar
 */
var MenuBarBuilder = /** @class */ (function () {
    function MenuBarBuilder() {
    }
    /**
     * Creates initial menu
     */
    MenuBarBuilder.createMenu = function () {
        var menu = electron_1.Menu.buildFromTemplate(MenuBarBuilder.template);
        electron_1.Menu.setApplicationMenu(menu);
    };
    /** If it is running on MacOS */
    MenuBarBuilder.isMac = process.platform === 'darwin';
    /** Menu template */
    MenuBarBuilder.template = [
    //     // APP MENU - avaliable only on MacOS
    //     ...(MenuBarBuilder.isMac ? [{
    //         label: app.name,
    //         submenu: [
    //             { role: 'about' },
    //             { type: 'separator' },
    //             { role: 'services' },
    //             { type: 'separator' },
    //             { role: 'hide' },
    //             { role: 'hideothers' },
    //             { role: 'unhide' },
    //             { type: 'separator' },
    //             { role: 'quit' }
    //         ]
    //     }] : []),
    //     // FILE MENU
    //     {
    //         label: 'File',
    //         submenu: [
    //             MenuBarBuilder.isMac ? { role: 'close' } : { role: 'quit' }
    //         ]
    //     },
    //     // EDIT
    //     {
    //         label: 'Edit',
    //         submenu: [
    //             { role: 'undo' },
    //             { role: 'redo' },
    //             { type: 'separator' },
    //             { role: 'cut' },
    //             { role: 'copy' },
    //             { role: 'paste' },
    //             ...(MenuBarBuilder.isMac ? [
    //                 { role: 'pasteAndMatchStyle' },
    //                 { role: 'delete' },
    //                 { role: 'selectAll' },
    //                 { type: 'separator' },
    //                 {
    //                     label: 'Speech',
    //                     submenu: [
    //                         { role: 'startSpeaking' },
    //                         { role: 'stopSpeaking' }
    //                     ]
    //                 }
    //             ] : [
    //                 { role: 'delete' },
    //                 { type: 'separator' },
    //                 { role: 'selectAll' }
    //             ])
    //         ]
    //     },
    //     // VIEW
    //     {
    //         label: 'View',
    //         submenu: [
    //             { role: 'reload' },
    //             { role: 'forceReload' },
    //             { role: 'toggleDevTools' },
    //             { type: 'separator' },
    //             { role: 'resetZoom' },
    //             { role: 'zoomIn' },
    //             { role: 'zoomOut' },
    //             { type: 'separator' },
    //             { role: 'togglefullscreen' }
    //         ]
    //     },
    //     // Window
    //     {
    //         label: 'Window',
    //         submenu: [
    //             { role: 'minimize' },
    //             { role: 'zoom' },
    //             ...(MenuBarBuilder.isMac ? [
    //                 { type: 'separator' },
    //                 { role: 'front' },
    //                 { type: 'separator' },
    //                 { role: 'window' }
    //             ] : [
    //                 { role: 'close' }
    //             ])
    //         ]
    //     },
    //     {
    //         role: 'help',
    //         submenu: [
    //             {
    //                 label: 'Learn More',
    //                 click: async () => {
    //                     const { shell } = require('electron')
    //                     await shell.openExternal('https://electronjs.org')
    //                 }
    //             }
    //         ]
    //     }
    ];
    return MenuBarBuilder;
}());
exports.MenuBarBuilder = MenuBarBuilder;
//# sourceMappingURL=menubar.js.map