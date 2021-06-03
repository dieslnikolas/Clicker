import { Injectable } from '@angular/core';
import { LogService } from './log.service';

// NODE NATIVE MODULES
//const NodeSSHRequire = window.require('node-ssh').NodeSSH;
//import { NodeSSH } from 'node-ssh';
import { AuthenticationService } from './autehentication.service';


@Injectable()
export class SSHService {

    //private _ssh: NodeSSH;

    constructor(private _log: LogService, private _loggedUserService: AuthenticationService) {
        // NODE NATIVE MODULES Libraries
        // this._ssh = new NodeSSHRequire();
    }

    /**
     * Call a ssh command but valid login is expected. Checkout logged-user.service.ts
     * @param command actual command
     */
    public async exec(command: string, credentials?: UserCredentials): Promise<SSHOutput> {

        // output
        let output = new SSHOutput();

        //// TRY TO SEND SSH
        //try {
            
        //    // try to prepare credentials
        //    if (credentials == null) {
        //        credentials.server = this._loggedUserService.user.server;
        //        credentials.username = this._loggedUserService.user.username;
        //        credentials.password = await this._loggedUserService.getSecret();
        //    }

        //    // connect
        //    var connection = await this._ssh.connect({ host: credentials.server, username: credentials.username, password: credentials.password })
        //    output.validationMessages = connection.connection;

        //    // LOG command
        //    await this._log.Write('SSH: ' + command);

        //    // send command
        //    var response = await this._ssh.execCommand(command)
        //    output.result = response.stdout;
        //    output.validationMessages = response.stderr;

        //    // remove ssh connection
        //    this._ssh.dispose();
        //}

        //// ERROR
        //catch (error) {
        //    output.validationMessages = error.message;
        //    this._log.Write(error);
        //}

        // return output
        return output;
    }
}

export class UserCredentials
{
    password: string;
    server: string;
    username: string;

    constructor() { }
}

/**
 * Output class for ssh calls
 */
export class SSHOutput {

    result: string;
    validationMessages: string;
    
    get isSuccess(): boolean {
        return this.validationMessages == null || this.validationMessages == '';
    }
    
    constructor() { }
}