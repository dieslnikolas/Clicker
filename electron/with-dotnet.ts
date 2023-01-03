import {app, dialog, ipcMain} from "electron"; // tslint:disable-line

import * as fs from "fs";
import * as path from "path";

import * as superagent from "superagent";

// @ts-ignore
import crossSpawn from "cross-spawn";
import * as childProcess from "child_process";

// @ts-ignore
import crypto from "crypto";

const DOTNET_SUFFIX = (process.platform === "win32") ? "win" : (process.platform === "darwin") ? "osx" : (process.platform === "linux") ? "ubuntu" : "unknown";
const DOTNET_DIST_FOLDER = "build/backend/backend-" + DOTNET_SUFFIX;
const DOTNET_FOLDER = "backend";
const DOTNET_BASENAME = "Clicker.Backend";

const isDev = !(process.env.NODE_ENV === "development");

let dotnetProc = null as any;

const apiDetails = {
    port: 0,
    signingKey: "",
};

async function getPortFree() : Promise<number>  {
    return new Promise( res => {
        // const srv = net.createServer();
        // srv.listen(0, () => {
        //     const port = srv.address().port
        //     srv.close((err) => res(port))
        // });
        res(5001);
    })
}

const initializeApi = async () => {
    // dialog.showErrorBox("success", "initializeApi");
    const availablePort = await getPortFree();
    apiDetails.port = isDev ? 5000 : availablePort;
    const key = isDev ? "devkey" : crypto.randomUUID();
    apiDetails.signingKey = key;

    // dialog.showErrorBox("info", "unpackaged");
    var apiURL = `http://localhost:${String(apiDetails.port)}/`;

    const srcPath = path.join(__dirname, "../..", DOTNET_FOLDER, DOTNET_BASENAME, DOTNET_BASENAME + ".csproj");
    const exePath = (process.platform === "win32") ?
        // Win    
        path.join(__dirname.replace("app.asar", "app.asar.unpacked"), "../..", DOTNET_DIST_FOLDER, DOTNET_BASENAME + ".exe") 
        // Linux-based
        : path.join(__dirname, DOTNET_DIST_FOLDER, DOTNET_BASENAME);

    if (__dirname.indexOf("app.asar") > 0) {
        // dialog.showErrorBox("info", "packaged");
        if (fs.existsSync(exePath)) {
            dotnetProc = childProcess.execFile(exePath, ["--apiport", String(apiDetails.port), "--signingkey", apiDetails.signingKey], {}, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    console.log(stderr);
                }
            });
            if (dotnetProc === undefined) {
                dialog.showErrorBox("Error", "dotnetProc is undefined");
            } else if (dotnetProc === null) {
                dialog.showErrorBox("Error", "dotnetProc is null");
            }
        } else {
            dialog.showErrorBox("Error", "Packaged dotnet app not found");
        }
    } else {
  
        if (fs.existsSync(srcPath)) {
            dotnetProc = crossSpawn("dotnet", [
                "run",
                "-p", srcPath,
                "--",
                "--urls", apiURL,
                "--signingkey", apiDetails.signingKey,
            ]);
        } else {
            dialog.showErrorBox("Error", "Unpackaged dotnet source not found");
        }
    }
    if (dotnetProc === null || dotnetProc === undefined) {
        dialog.showErrorBox("Error", "unable to start dotnet server");
    } else {
        console.log("Server running at " + apiURL);
    }
    console.log("leaving initializeApi()");
};

ipcMain.handle("getApiDetails", async (event: Electron.Event, ...args: any) => {
    if (apiDetails.signingKey !== "") {
        return JSON.stringify(apiDetails);
    } 
    else {
        const result = await initializeApi()
        return JSON.stringify(apiDetails);
    }
});

const exitDotnetProc = () => {
    //
    // NOTE: killing processes in node is surprisingly tricky and a simple
    //             pyProc.kill() totally isn't enough. Instead send a message to
    //             the pyProc web server telling it to exit
    //
    superagent.get("http://127.0.0.1:" + apiDetails.port + "/graphql/?query=%7Bexit(signingkey:\"" + apiDetails.signingKey + "\")%7D").then().catch();
    dotnetProc = null;
};

app.on("will-quit", exitDotnetProc);