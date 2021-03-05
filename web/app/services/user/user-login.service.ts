import { Injectable } from '@angular/core';
import { BaseService } from "../base.service";
import { LoggedUserService, User } from "../../providers/logged-user.service";
import { SSHService, UserCredentials } from "../../providers/ssh.service";

/**
 * Service for logging and logout user
 */
@Injectable({ providedIn: 'root' })
export class UserLoginService extends BaseService {

    constructor(private _sshService: SSHService, private _loggedUserService: LoggedUserService) {
        super();
    }

    /**
     * Login (connect to ssh)
     * @param input input class for login method
     */
    public async login(input: UserLoginServiceInput): Promise<UserLoginServiceOutput> {

        let credentials: UserCredentials = new UserCredentials();
        let result = new UserLoginServiceOutput();

        credentials.Password = input.Password;
        credentials.Server = input.Server;
        credentials.Username = input.Username;

        // try to connect to the server
        await this._sshService.exec('whoami', credentials).then(output => {
            // it works, lets login user
            if (output.IsSuccess) {
                this._loggedUserService.login(input.Server, input.Username, input.Password, input.IsRemember);
            }
            // return validations
            else {
                result.ValidationMessages = output.validationMessages;
            }
        });

        return result;
    }

    /**
     * 
     */
    tryLogin(): User {
       return this._loggedUserService.user ?? new User(null);
    }

    /**
     * Logout (disconnect from SSH)
     */
    public async logout(): Promise<void> {
        this._loggedUserService.logout();
    }
}

export class UserLoginServiceInput {
    Server: string;
    Username: string;
    Password: string;
    IsRemember: boolean = false;
}

export class UserLoginServiceOutput {
    ValidationMessages: string;
    get IsSuccess(): boolean {
        return this.ValidationMessages == null;
    }
}