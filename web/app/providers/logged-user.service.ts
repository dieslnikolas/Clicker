import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';

@Injectable()
export class LoggedUserService {

    // current logged users
    private userSubject: BehaviorSubject<User>;
    private localStorageName: string = "_loggedUser";

    constructor(private _electronService: ElectronService) {
    }

    /**
    * Getter for actual user
    */
    public get user(): User {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this.localStorageName)));
        return this.userSubject == null ? null : this.userSubject.value;
    }

    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async logout(): Promise<void> {

        let loggedUser = this.user;

        // logout user
        loggedUser.IsLogged = false;
        loggedUser.Password = null;

        localStorage.setItem(this.localStorageName, JSON.stringify(loggedUser));
    }

    /**
     * Tries to connect using ssh port:21 an if it works, then it stores credentials
     * @param server remote server
     * @param user username
     * @param password password
     */
    public async login(server: string, username: string, password: string, isRemember: boolean): Promise<void> {

        let user = new User(this._electronService);

        user.Server = server;
        user.Username = username;
        user.IsRemember = isRemember;
        user.IsLogged = true;

        localStorage.setItem(this.localStorageName, JSON.stringify(user));
        this.userSubject = new BehaviorSubject(user);
        // this._electronService.ipcRenderer.sendSync('keyter-set', [username, password]);
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
    
    constructor(private _electronService: ElectronService) { }
    
    /**
     * 
     * @returns Tries to read credentials from system keychain
     */
    async GetPasswordFromKeyChain(): Promise<string> {
        return this._electronService.ipcRenderer.sendSync('keyter-get', [this.Username]);
    }

}