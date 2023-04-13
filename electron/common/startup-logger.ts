import { Settings } from './settings';

// This class is used to log the startup information
export class StartupLogger {
    // It just logs the current directory and environment
    public static logStartup(): void {
        console.log(`Directory: ${__dirname}`);
        console.log(`Environment: ${Settings.IS_DEV ? "Development" : "Production"}`);
    }
}