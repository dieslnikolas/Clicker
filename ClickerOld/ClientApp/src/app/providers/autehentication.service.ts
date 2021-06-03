import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';

@Injectable()
export class AuthenticationService {

    // current logged users 
    private userSubject: BehaviorSubject<User>;
    private localStorageName: string = "_auth";
    private applicationName: string;

    constructor(private _logService: LogService) {
        this.applicationName = 'Clicker';
    }

    /**
    * Getter for actual user
    */
    public get user(): User {
        let deserialized = JSON.parse(localStorage.getItem(this.localStorageName));
        this.userSubject = new BehaviorSubject(deserialized);
        return this.userSubject == null ? null : this.userSubject.value;
    }

    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async logout(): Promise<void> {
        let authentication = this.user;

        // logout user
        authentication.isLogged = false;
        authentication.isRemember = false;
        authentication.password = null;

        localStorage.setItem(this.localStorageName, JSON.stringify(authentication));
        // Keytar.deletePassword(this.applicationName, authentication.username);
    }

    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async login(server: string, username: string, password: string, isRemember: boolean): Promise<void> {

        let user = new User();

        user.server = server;
        user.username = username;
        user.isRemember = isRemember;
        user.isLogged = true;

        this.userSubject = new BehaviorSubject(user);
        localStorage.setItem(this.localStorageName, JSON.stringify(user));

        if (user.isRemember) {
            // Keytar.setPassword(this.applicationName, user.username, password);
        }
    }

    /**
     * Try to get user secret from keytar
     * @returns user's secret
     */
    public async getSecret(): Promise<string> {

        let user = this.user;
        if (!user || !user.username) {
            return null;
        }
        return null; // await Keytar.getPassword(this.applicationName, this.user.username);
    }
}

/**
 * Input class for UserCredentials
 * method
 */
export class User {

    server: string;
    username: string;
    password: string;
    isLogged: boolean = false;
    isRemember: boolean = false;

    constructor() { }

}