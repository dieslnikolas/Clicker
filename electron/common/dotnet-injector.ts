import {app, dialog, ipcMain} from "electron"; // tslint:disable-line
import * as fs from "fs";
import * as path from "path";
import * as superagent from "superagent";
import "cross-spawn";
import * as childProcess from "child_process";
import "crypto";
import {Settings} from "./settings";

// Inject the .NET API
export class DotnetInjector {

    // The .NET API process
    private apiDetails = {
        port: 0,
        signingKey: "",
    };

    // The .NET API process
    private dotnetProc = null as any;

    constructor() {
        // IPC and electron.app
        this.addListeners();
    }


    // Initialize the .NET API
    public async initializeApi() {

        // Get the API details
        // Set port and signing key
        this.apiDetails.port = Settings.IS_DEV ? 5000 : await this.getPortFree();
        this.apiDetails.signingKey = Settings.IS_DEV ? "devkey" : crypto.randomUUID();
        ;

        var apiURL = `http://localhost:${String(this.apiDetails.port)}/`;

        // path to source code
        const srcPath = path.join(__dirname, "../..", Settings.DOTNET_FOLDER, Settings.DOTNET_BASENAME, Settings.DOTNET_BASENAME + ".csproj");

        // path to executable
        const exePath = (process.platform === "win32") ?
            // Win    
            path.join(__dirname.replace("app.asar", "app.asar.unpacked"), "../..", Settings.DOTNET_DIST_FOLDER, Settings.DOTNET_BASENAME + ".exe")
            // Linux-based
            : path.join(__dirname, Settings.DOTNET_DIST_FOLDER, Settings.DOTNET_BASENAME);

        // If Electron is packaged
        if (__dirname.indexOf("app.asar") > 0) {

            // Tries to find executable
            if (fs.existsSync(exePath)) {

                // Run API with port and signing key
                this.dotnetProc = childProcess.execFile(exePath, ["--apiport", String(this.apiDetails.port), "--signingkey", this.apiDetails.signingKey], {}, (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                        console.log(stderr);
                    }
                });

                // Check if dotnetProc is defined
                if (this.dotnetProc === undefined) {
                    dialog.showErrorBox("Error", "dotnetProc is undefined");
                } 
                else if (this.dotnetProc === null) {
                    dialog.showErrorBox("Error", "dotnetProc is null");
                }
            } 

            // Executable not found
            else {
                dialog.showErrorBox("Error", "Packaged dotnet app not found");
            }
        }

        // If Electron is not packaged
        else {

            // Tries to find source code
            if (fs.existsSync(srcPath)) {
                // this.dotnetProc = crossSpawn("dotnet", [
                //     "run",
                //     "-p", srcPath,
                //     "--",
                //     "--urls", apiURL,
                //     "--signingkey", this.apiDetails.signingKey,
                // ]);
            } 

            // Source code not found
            else {
                dialog.showErrorBox("Error", "Unpackaged dotnet source not found");
            }
        }

        // Check if dotnetProc is defined
        if (this.dotnetProc === null || this.dotnetProc === undefined) {
            dialog.showErrorBox("Error", "unable to start dotnet server");
        } 

        // Server is running
        else {
            console.log("Server running at " + apiURL);
        }
    }

    // Get a free port
    private async getPortFree() : Promise<number> {
        var net = require('net');

        return new Promise( res => {
            const srv = net.createServer();
            srv.listen(0, () => {
                const port = srv.address().port
                srv.close((err: any) => res(port))
            });
        })
    }

    // Get API Details
    private async getApiDetails() {
        // const apiDetails = await ipcMain.invoke("getApiDetails");
        // return JSON.parse(apiDetails);
    }

    // Add IPC Main Listener
    // TODO: this is soo ugly
    private addListeners() {
        // Electron main process
        ipcMain.handle("getApiDetails", async (event: Electron.Event, ...args: any) => {

            // If the signing key is not empty, return the details
            if (this.apiDetails.signingKey !== "") {
                return JSON.stringify(this.apiDetails);
            }

            // Otherwise, initialize the API
            else {
                const result = await this.initializeApi()
                return JSON.stringify(this.apiDetails);
            }

        });

        // Electron app listener before exit
        app.on("will-quit", this.exitDotnetProc);
    }

    // Exit the .NET API
    private exitDotnetProc() {
        //
        // NOTE: killing processes in node is surprisingly tricky and a simple
        //             pyProc.kill() totally isn't enough. Instead send a message to
        //             the pyProc web server telling it to exit
        //
        superagent.get("http://127.0.0.1:" + this.apiDetails.port + "/graphql/?query=%7Bexit(signingkey:\"" + this.apiDetails.signingKey + "\")%7D").then().catch();
        this.dotnetProc = null;
    };
}