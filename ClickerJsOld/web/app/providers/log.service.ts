import { Injectable } from '@angular/core';

// Electron-log
const ElectronLogRequire = window.require('electron-log');
import { ElectronLog } from 'electron-log';

@Injectable()
export class LogService {

    private electronLog: ElectronLog

    constructor() {
        this.electronLog = ElectronLogRequire;
        this.electronLog.transports.console.format = '{h}:{i}:{s} {text}'; // defaults format for each row
    }

    /**
     * Writes a message to console and file
     * @param message Message
     * @param error Error
     */
    public async Write(message: any, error?: Error): Promise<void> {
        // its error log as error
        if (error) {
            this.electronLog.error(error.message);
            this.electronLog.error(error.stack);
        }

        // is standard info log
        else {
            this.electronLog.info(message);
        }
    }
}