import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron'

// node native modules
import { NodeSSH } from 'node-ssh'

@Injectable()
export class BaseService {

    public connector: NodeSSH;

    constructor(_electronService: ElectronService) {

        // workaround to get node native modules into the angular
        if (_electronService.isElectronApp) {
            this.connector = new _electronService.remote.require('node-ssh').NodeSSH();
            console.log(this.connector);
        }
    }
}
