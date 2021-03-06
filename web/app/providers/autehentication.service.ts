import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';

const Keytar = window.require('keytar');

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
        let Authentication = this.user;

        // logout user
        Authentication.IsLogged = false;
        Authentication.Password = null;

        localStorage.setItem(this.localStorageName, JSON.stringify(Authentication));
        Keytar.deletePassword(this.applicationName, Authentication.Username);
    }

    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async login(server: string, username: string, password: string, isRemember: boolean): Promise<void> {

        let user = new User();

        user.Server = server;
        user.Username = username;
        user.IsRemember = isRemember;
        user.IsLogged = true;

        localStorage.setItem(this.localStorageName, JSON.stringify(user));
        this.userSubject = new BehaviorSubject(user);
        Keytar.setPassword(this.applicationName, user.Username, password);
    }

    /**
     * Try to get user secret from keytar
     * @returns user's secret
     */
    public async getSecret() {
        return await Keytar.getPassword(this.applicationName, this.user.Username);
    }
}

/**
 * Input class for UserCredentials
 * method
 */
export class User {

    Server: string;
    Username: string;
    Password: string;
    IsLogged: boolean = false;
    IsRemember: boolean = false;
    ValidationMessages: string;

    get IsSuccess(): boolean {
        return this.ValidationMessages == null || this.ValidationMessages == '';
    }
    
    constructor() { }

}