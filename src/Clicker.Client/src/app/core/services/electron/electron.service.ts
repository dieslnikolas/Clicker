import { Injectable } from '@angular/core';
import { CoreModule } from '../../core.module';

@Injectable({
    providedIn: CoreModule
})
export class ElectronService {

    // ELECTRON
    ipcRenderer;
    webFrame;
    remote;

    // NODEJS
    childProcess;
    fs;
    path;
    log4js;

    /**
     * If application si running in electron container
     */
    get isElectron(): boolean {
        return true; // !!(window && window.process && window.process.type);
    }

    /**
     * If platform is windows
     */
    get isWindows(): boolean {
        return true; // this.remote.process.platform === 'win32'; // valid even for 64bit
    }

    /**
     * If platform is mac
     */
    get isMac(): boolean {
        return false; // this.remote.process.platform === 'darwin';
    }

    constructor() {

        // Conditional imports
        if (this.isElectron) {
        }
    }
}
