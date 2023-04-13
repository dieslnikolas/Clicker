import * as path from "path";
import { app, BrowserWindow } from "electron";
import { Shell } from "./windows/shell";
import { Settings } from "./common/settings";
import { StartupLogger } from "./common/startup-logger";
import { DotnetInjector } from "./common/dotnet-injector";

// 1) Logs the startup information
StartupLogger.logStartup();

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    
    // On OS X it is common for applications and their menu bar
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// This method will be called when Electron has finished
app.on("ready", () => {
    
    // Install source map support for stack traces
    if (Settings.IS_DEV) {
        const sourceMapSupport = require("source-map-support");
        sourceMapSupport.install();
    }
    
    // Create the browser window.
    var win = new Shell(Settings.WIDTH, Settings.HEIGHT, Settings.TITLE, Settings.IS_DEV);
    win.createWindow();
    
    // Inject the .NET API
    var dotnetInjector = new DotnetInjector()
    dotnetInjector.initializeApi();
});