import { Injectable } from '@angular/core';
import { BaseService } from "../base.service";
import { AuthenticationService, User } from "../../providers/autehentication.service";
import { SSHService, UserCredentials } from "../../providers/ssh.service";

/**
 * Service for logging and logout user
 */
@Injectable({ providedIn: 'root' })
export class UserLoginService extends BaseService {

    constructor(private _sshService: SSHService, private _authenticationService: AuthenticationService) {
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
                this._authenticationService.login(input.Server, input.Username, input.Password, input.IsRemember);
            }
            // return validations
            else {
                result.ValidationMessages = output.validationMessages;
            }
        });

        return result;
    }

    /**
     * Try if there is IsRemember set and secret
     * Basicali, check if there is at least posibility for login
     */
    public async checkPersistentLogin(): Promise<boolean> {
        let result = await this._authenticationService.getSecret();
        return result != null && this._authenticationService.user.IsRemember;
    }

    /**
     * Logout (disconnect from SSH)
     */
    public async logout(): Promise<void> {
        this._authenticationService.logout();
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
        return this.ValidationMessages == null || this.ValidationMessages == '';
    }
}