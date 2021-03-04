import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Node-ssh
const NodeSSHRequire = window.require('node-ssh').NodeSSH;
import { NodeSSH } from 'node-ssh';

import { LogService } from './log.service';

@Injectable()
export class LoggedUserService {

    private _ssh: NodeSSH;

    // current logged users
    private userSubject: BehaviorSubject<User>;
    // name of the localStorage item
    private localStorageName: string = '_loggedUser';

    constructor(private _log: LogService) {
        // NodeJS Libraries
        this._ssh = new NodeSSHRequire();
    }

     /**
     * Getter for actual user
     */
    public get User(): User {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this.localStorageName)));
        return this.userSubject.value;
    }

    
    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async logout(): Promise<void> {
        this.userSubject = null;
        localStorage.setItem(this.localStorageName, null);
    }

    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async login(server: string, username: string, password: string): Promise<User> {

        // output
        let output: User = new User();

        // TRY TO SEND SSH
        try {

            // connect
            var connection = await this._ssh.connect({ host: server, username: username, password: password })
            output.ValidationMessages = connection.connection;

            // send command
            var response = await this._ssh.execCommand('whoami')
            output.Username = server;
            output.Username = response.stdout;
            output.ValidationMessages = response.stderr;

            localStorage.setItem(this.localStorageName, JSON.stringify(output));
            this.userSubject = new BehaviorSubject(output);

            // remove ssh connection
            this._ssh.dispose();

        }

        // ERROR
        catch (error) {
            output.ValidationMessages = error.message;
            this._log.Write(error);
        }

        // return output
        return output;
    }
}

/**
 * Input class for UserLogin method
 */
export class User {
    Server: string;
    Username: string;
    User: string;
    Password: string;
    IsRemember: boolean = true;
    ValidationMessages: string;

    constructor() { }

    get IsSuccess(): boolean {
        return this.ValidationMessages == null;
    }
}