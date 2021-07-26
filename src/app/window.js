"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowBuilder = void 0;
var electron_1 = require("electron");
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
        // Screen
        var electronScreen = electron_1.screen;
        var size = electronScreen.getPrimaryDisplay().workAreaSize;
        // Create the browser window.
        WindowBuilder.win = new electron_1.BrowserWindow({
            x: 0,
            y: 0,
            width: size.width,
            height: size.height,
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: (args) ? true : false,
                contextIsolation: false,
                enableRemoteModule: true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
            },
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
            // let pathIndex = './index.html';
            var pathIndex = '';
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
//# sourceMappingURL=window.js.map