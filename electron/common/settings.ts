var path = require('path');

const dotenv = require('dotenv');

// This file is used to store the settings for the electron app
export const Settings = {
    WIDTH: parseInt(dotenv.WIDTH),
    HEIGHT: parseInt(dotenv.HEIGHT),
    TITLE: dotenv.TITLE,
    IS_DEV: true, //(dotenv.NODE_ENV === "development"),
    DOTNET_SUFFIX: getPlatform(),
    // @ts-ignore - this is because this is a variable that is set by the build process
    DOTNET_DIST_FOLDER:  getDistFolder(),
    DOTNET_FOLDER:  getDotnetFolder(),
    DOTNET_BASENAME: getBaseName(),
    DIRECTORY: process.cwd(),
    API_URL_WITHOUTPORT : `http://localhost:`,
    API_SOURCE_PATH : path.join(process.cwd(), getDotnetFolder(), getBaseName(), getBaseName() + ".csproj"),
    API_EXE_PATH : (process.platform === "win32") ?
        // Win    
        path.join(process.cwd().replace("app.asar", "app.asar.unpacked"), "../..", getDistFolder(), getBaseName() + ".exe")
        // Linux-based
        : path.join(process.cwd(), getDistFolder(), getBaseName())

}

// Gets current platform
function getPlatform() {
    return (process.platform === "win32") ? "win" : (process.platform === "darwin") ? "osx" : (process.platform === "linux") ? "ubuntu" : "unknown"
}

// Gets the dist folder
function getDistFolder() {
    return "build/backend/backend-" + getPlatform()
}

// Gets the base name
function getBaseName() {
    return "Clicker.Backend"
}

// Gets the dotnet folder
function getDotnetFolder() {
    return "backend"
}