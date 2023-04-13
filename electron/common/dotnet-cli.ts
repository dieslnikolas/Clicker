import {app, dialog, ipcMain} from "electron"; // tslint:disable-line
import {Settings} from "./settings";
import * as fs from "fs";
import * as path from "path";
import * as superagent from "superagent";
import * as childProcess from "child_process";
import * as crossSpawn from "cross-spawn";
import * as crypto from "crypto";

// Inject the .NET API
export class DotnetCLI {
    
    // Check if Electron is packaged
    private get isElectronPacked() {
        return Settings.DIRECTORY.indexOf("app.asar") > 0
    }
    
    // Add listeners
    private get apiURL() {
        return `${String(Settings.API_URL_WITHOUTPORT)}${String(this.apiDetails.port)}/swagger/index.html`;
    }

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

        await this.setupApiDetails();
       
        // If Electron is packaged
        if (this.isElectronPacked) {
            this.runApiFromExe();
        }

        // If Electron is not packaged
        else {
            this.runApiFromSource();
        }

        // Wait for the API to start
        this.checkApiState();
    }

    // Check if api runs or not
    private checkApiState() {
        // Check if dotnetProc is defined
        if (this.dotnetProc === null || this.dotnetProc === undefined) {
            dialog.showErrorBox("Error", "unable to start dotnet server");
        }

        // Server is running
        else {
            console.log("Server running at " + this.apiURL);
            console.log("Process ID: " + this.dotnetProc.pid);
            console.info("Signing key: " + this.apiDetails.signingKey);
            console.info("Port: " + this.apiDetails.port);
        }
    }

    // Tries run api via .csproj
    private runApiFromSource() {
        // Tries to find source code
        if (fs.existsSync(Settings.API_SOURCE_PATH)) {
            this.dotnetProc = crossSpawn.spawn("dotnet", [
                "run",
                "-p", Settings.API_SOURCE_PATH,
                "--urls", this.apiURL,
                "--signingkey", this.apiDetails.signingKey,
            ]);
        }

        // Source code not found
        else {
            dialog.showErrorBox("Error", "Unpackaged REST API source code not found on " + Settings.API_SOURCE_PATH + "");
        }
    }

    // Tries to run the API from the executable
    private runApiFromExe() {
        // Tries to find executable
        if (fs.existsSync(Settings.API_EXE_PATH)) {

            // Run API with port and signing key
            this.dotnetProc = childProcess.execFile(Settings.API_EXE_PATH, ["--apiport", String(this.apiDetails.port), "--signingkey", this.apiDetails.signingKey], {}, (error, stdout, stderr) => {
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
    
    // Setup API Details
    private async setupApiDetails() {
        // Get the API details
        // Set port and signing key
        this.apiDetails.port = Settings.IS_DEV ? 5000 : await this.getPortFree();
        this.apiDetails.signingKey = crypto.randomUUID()
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