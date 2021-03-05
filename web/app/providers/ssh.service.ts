import { Injectable } from '@angular/core';
import { LogService } from './log.service';

// NODE NATIVE MODULES
const NodeSSHRequire = window.require('node-ssh').NodeSSH;
import { NodeSSH } from 'node-ssh';
import { LoggedUserService } from './logged-user.service';


@Injectable()
export class SSHService {

    private _ssh: NodeSSH;

    constructor(private _log: LogService, private _loggedUserService: LoggedUserService) {
        // NODE NATIVE MODULES Libraries
        this._ssh = new NodeSSHRequire();
    }

    /**
     * Call a ssh command but valid login is expected. Checkout logged-user.service.ts
     * @param command actual command
     */
    public async exec(command: string, credentials?: UserCredentials): Promise<SSHOutput> {

        // output
        let output = new SSHOutput();

        // TRY TO SEND SSH
        try {
            
            // try to prepare credentials
            if (credentials == null) {
                credentials.Server = this._loggedUserService.user.Server;
                credentials.Username = this._loggedUserService.user.Username;
                credentials.Password = await this._loggedUserService.user.GetPasswordFromKeyChain();
            }

            // connect
            var connection = await this._ssh.connect({ host: credentials.Server, username: credentials.Username, password: credentials.Password })
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

export class UserCredentials
{
    Password: string;
    Server: string;
    Username: string;

    constructor() { }
}

export class SSHOutput {

    public result: string;
    public validationMessages: string;
    
    get IsSuccess(): boolean {
        return this.validationMessages == null;
    }
    
    constructor() { }
}