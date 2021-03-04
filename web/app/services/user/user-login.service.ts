import { Injectable } from '@angular/core';
import { BaseService } from "../base.service";
import { LoggedUserService, User } from "../../providers/logged-user.service";

/**
 * Service for logging and logout user
 */
@Injectable({ providedIn: 'root' })
export class UserLoginService extends BaseService {

    constructor(private _loggedUserService: LoggedUserService) {
        super();
    }

    /**
     * Login (connect to ssh)
     * @param input input class for login method
     */
    public async Login(input: User): Promise<User> {
        return this._loggedUserService.login(input.Server, input.User, input.Password);
    }

    /**
     * Logout (disconnect from SSH)
     */
    public async Logout(): Promise<void> {
        this._loggedUserService.logout();
    }
}