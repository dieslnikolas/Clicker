"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowBuilder = void 0;
var electron_1 = require("electron");
var electron = require("electron");
var path = require("path");
var fs = require("fs");
var url = require("url");
/**
 * Builder for creating app window
 */
var WindowBuilder = /** @class */ (function () {
    function WindowBuilder() {
    }
    /**
     * @returns Returns instance of the window
     */
    WindowBuilder.getWindow = function () {
        return WindowBuilder.win;
    };
    /**
     *
     * @returns Arguments which were used to run application
     */
    WindowBuilder.getArguments = function () {
        // Arguments
        return process.argv.slice(1).some(function (val) { return val === '--serve'; });
    };
    /**
     * Creates app shel
     * @returns Window shell
     */
    WindowBuilder.createWindow = function () {
        // arguments
        var args = WindowBuilder.getArguments();
        // Dont want to recreate window each time 
        if (WindowBuilder.win != null) {
            return WindowBuilder.win;
        }
        // Create the browser window.
        var WINDOW_WIDTH = 1024;
        var WINDOW_HEIGHT = 768;
        var bounds = electron.screen.getPrimaryDisplay().bounds;
        var x = bounds.x + ((bounds.width - WINDOW_WIDTH) / 2);
        var y = bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2);
        WindowBuilder.win = new electron_1.BrowserWindow({
            x: x,
            y: y,
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            frame: process.platform === 'darwin',
            center: true,
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: (args) ? true : false,
                contextIsolation: false,
                enableRemoteModule: true,
                devTools: true,
            },
            icon: path.join(__dirname, '/../../dist/assets/icons/favicon.ico')
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
            var pathIndex = './index.html';
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
        WindowBuilder.win.on('closed', function () {
            // Dereference the window object, usually you would store window
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            WindowBuilder.win = null;
        });
        // Custom FRAME
        CreateFrame(WindowBuilder.win);
        // returns window
        return WindowBuilder.win;
    };
    /**
     * Main window
     */
    WindowBuilder.win = null;
    return WindowBuilder;
}());
exports.WindowBuilder = WindowBuilder;
/**
 * Custom JS Frame
 */
function CreateFrame(win) {
    // THIS IS IN ANGULAR
}
//# sourceMappingURL=window.js.map