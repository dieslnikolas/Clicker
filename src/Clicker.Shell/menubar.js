"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    MenuBarBuilder.template = __spreadArray([], (MenuBarBuilder.isMac ? [{
            label: electron_1.app.name,
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
        }] : []), true);
    return MenuBarBuilder;
}());
exports.MenuBarBuilder = MenuBarBuilder;
//# sourceMappingURL=menubar.js.map