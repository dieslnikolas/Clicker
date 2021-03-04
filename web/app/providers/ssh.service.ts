import { Injectable } from '@angular/core';

// NODE NATIVE MODULES
const NodeSSHRequire = window.require('node-ssh').NodeSSH;
import { NodeSSH } from 'node-ssh';

// STANDARD IMPORTS
import { LogService } from './log.service';

@Injectable()
export class SSHService {

    private _ssh: NodeSSH;

    constructor(private _log: LogService) {
        // NODE NATIVE MODULES Libraries
        this._ssh = new NodeSSHRequire();
    }

    /**
     * Call a ssh command but valid login is expected. Checkout logged-user.service.ts
     * @param command actual command
     */
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