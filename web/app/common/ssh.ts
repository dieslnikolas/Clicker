import { Injectable } from '@angular/core';

// Node-ssh
const NodeSSHRequire = window.require('node-ssh').NodeSSH;
import { NodeSSH } from 'node-ssh';

import { Log } from './log';

@Injectable()
export class SSH {

    private _ssh: NodeSSH;
    private _log: Log;

    constructor(log: Log) {
        // NodeJS Libraries
        this._ssh = new NodeSSHRequire();
        this._log = new Log();
    }

    public async exec(command: string): Promise<SSHOutput> {

        // output
        let output = new SSHOutput();

        // TRY TO SEND SSH
        try {
            
            // connect
            var connection = await this._ssh.connect({ host: 'dieslnikolas.cz', username: 'root', password: '' })
            output.validationMessages = connection.connection;

            // LOG command
            await this._log.Write('SSH: ' + command);

            // send command
            var response = await this._ssh.execCommand(command)
            output.result = response.stdout;
            output.validationMessages = response.stderr;

            // remove ssh connection
            this._ssh.dispose();

        }

        // ERROR
        catch (error) {
            this._log.Write(error);
        }

        // return output
        return output;
    }
}

export class SSHOutput {

    public result: string;
    public validationMessages: string;

    constructor() { }

    get IsSuccess(): boolean {
        return this.validationMessages == null;
    }
}