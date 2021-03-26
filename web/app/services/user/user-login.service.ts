import { Injectable } from '@angular/core';
import { BaseService } from "../base.service";
import { AuthenticationService, User } from "../../providers/autehentication.service";
import { SSHService, UserCredentials } from "../../providers/ssh.service";
import { Model } from "../../common/model";

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
    public async login(input: UserLoginServiceInput): Promise<Model<User>> {

        var output = new Model<User>();
        let credentials: UserCredentials = new UserCredentials();

        credentials.password = input.password;
        credentials.server = input.server;
        credentials.username = input.username;

        // try to connect to the server
        await this._sshService.exec('whoami', credentials).then(sshResult => {
            
            // it works, lets login user
            if (sshResult.isSuccess) {
                this._authenticationService.login(input.server, input.username, input.password, input.isRemember);
            }

            // save result
            output.validationMessages = sshResult.validationMessages;

        });

        return output;
    }

    /**
     * Try if there is IsRemember set and secret
     * Basicali, check if there is at least posibility for login
     */
    public async checkPersistentLogin(): Promise<Model<User>> {

        var output = new Model<User>();
        let secret = await this._authenticationService.getSecret();
        let user = await this._authenticationService.user;

        // Automatic login possible - password is saved
        if (secret) {

            // try login
            let input = new UserLoginServiceInput();

            input.isRemember = user.isRemember;
            input.password = secret;
            input.server = user.server;
            input.username = user.username;

            await this.login(input).then(result => output = result);
        }

        // return at least something
        output.data = user;
        output.data.isLogged = false;

        //  couldn't automaticaly connect
        await this.wait(1000);
        return output;
    }

    /**
     * Logout (disconnect from SSH)
     */
    public async logout(): Promise<void> {
        this._authenticationService.logout();
    }
}

export class UserLoginServiceInput {
    server: string;
    username: string;
    password: string;
    isRemember: boolean = false;
}