import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for logging and logout user
 */
@Injectable({ providedIn: 'root' })
export class UserLoginService {

    // current logged users
    private userSubject: BehaviorSubject<UserLoginOutput>;

    // name of the localStorage item
    private _loggedUser: string = '_loggedUser';

    constructor() {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this._loggedUser)));
    }

    /**
     * Getter for actual user
     */
    public get User(): UserLoginOutput {
        return this.userSubject.value; 
    }

    /**
     * Login (connect to ssh)
     * @param input input class for login method
     */
    public Login(input: UserLoginInput): void {
        localStorage.setItem(this._loggedUser, JSON.stringify(input));
        this.userSubject = new BehaviorSubject(input);
    }

    /**
     * Logout (disconnect from SSH)
     */
    public Logout(): void {
        localStorage.removeItem(this._loggedUser);
        this.userSubject.next(null);
    }
}

/**
 * Input class for UserLogin method
 */
export class UserLoginInput {
    User: string;
    Server: string;
    Password: string;
    IsRemember: boolean = true;
}

/**
 * Output class for UserLogin method
 */
export class UserLoginOutput extends UserLoginInput {
    
}