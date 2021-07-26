"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Class for creating menubar
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    /**
     * Creates initial menu
     */
    Logger.catch = function (ex) {
        console.error(this.isRenderProcess ? "RENDERER PROCESS" : "MAIN PROCESS:", ex);
    };
    /** Where error comes from */
    Logger.isRenderProcess = false;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map