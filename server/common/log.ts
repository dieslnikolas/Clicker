import * as electronLog from 'electron-log'

export class Log {

    constructor() {
        // defaults format for each row
        electronLog.transports.console.format = '{h}:{i}:{s} {text}';
    }

    /**
     * Writes a message to console and file
     * @param message Message
     * @param error Error
     */
    public Write(message: string, error?: Error): void {
        
        // its error log as error
        if (error) {
            electronLog.error(error.message);
            electronLog.error(error.stack);
        }

        // is standard info log
        else {
            electronLog.info(message);
        }
        
    }
}