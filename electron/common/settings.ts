const dotenv = require('dotenv');

// This file is used to store the settings for the electron app
export const Settings = {
    WIDTH: parseInt(dotenv.WIDTH),
    HEIGHT: parseInt(dotenv.HEIGHT),
    TITLE: dotenv.TITLE,
    IS_DEV: (dotenv.NODE_ENV === "development"),
    DOTNET_SUFFIX:  (process.platform === "win32") ? "win" : (process.platform === "darwin") ? "osx" : (process.platform === "linux") ? "ubuntu" : "unknown",
    // @ts-ignore - this is because this is a variable that is set by the build process
    DOTNET_DIST_FOLDER:  "build/backend/backend-" + this.DOTNET_SUFFIX,
    DOTNET_FOLDER:  "backend",
    DOTNET_BASENAME: "Clicker.Backend"
}