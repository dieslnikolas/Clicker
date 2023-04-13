import { Settings } from './settings';

// This class is used to log the startup information
export class StartupLogger {
    // It just logs the current directory and environment
    public static logStartup(): void {
        console.warn(`Directory: ${Settings.DIRECTORY}`);
        console.warn(`Environment: ${Settings.IS_DEV ? "Development" : "Production"}`);
        console.info(`DotnetBaseName: ${Settings.DOTNET_BASENAME}`);
        console.info(`DotnetFolder: ${Settings.DOTNET_FOLDER}`);
        console.info(`DotnetDistFolder: ${Settings.DOTNET_DIST_FOLDER}`);
        console.info(`DotnetSuffix: ${Settings.DOTNET_SUFFIX}`);
        console.info(``);
    }
}