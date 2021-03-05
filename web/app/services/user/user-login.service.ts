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
    public async login(input: User): Promise<User> {
        return this._loggedUserService.login(input);
    }

    /**
     * Logout (disconnect from SSH)
     */
    public async logout(): Promise<void> {
        this._loggedUserService.logout();
    }

    public get user(): User{
        return this._loggedUserService.user ?? new User();
    }
}