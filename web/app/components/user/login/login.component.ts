import { Component, OnInit } from '@angular/core';
import { UserLoginService, UserLoginServiceInput } from '../../../services/user/user-login.service'
import { Router } from '@angular/router'
import { User, AuthenticationService } from 'web/app/providers/autehentication.service';

@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    model: User;

    constructor(private _authenticationService: AuthenticationService, private _userLoginService: UserLoginService, private _router: Router) { }

    ngOnInit(): void {

        // try if autologin is enabled
        this._userLoginService.checkPersistentLogin().then(result => {
            
            // Automatic login possible
            if (result) {

                // loads secret
                this._authenticationService.getSecret().then(secret => {

                    // try login
                    this.tryLogin(
                        this._authenticationService.user.Server,
                        this._authenticationService.user.Username,
                        secret,
                        this._authenticationService.user.IsRemember
                    );

                });

            }
            else {

                // prepare model for the page
                this.model = this._authenticationService.user ?? new User();

            }
        });
    }

    /**
     * Tries to loggin user
     */
    public LogIn(): void {
        this.tryLogin(this.model.Server, this.model.Username, this.model.Password, this.model.IsRemember)
    }

    /**
     * Try to login user
     * @param server remote pc
     * @param username user
     * @param password secret
     * @param isRemember if login is forever
     */
    tryLogin(server: string, username: string, password: string, isRemember: boolean) {

        let input = new UserLoginServiceInput();

        input.IsRemember = isRemember;
        input.Password = password;
        input.Server = server;
        input.Username = username;

        this._userLoginService.login(input).then(result => {
            if (result.IsSuccess) {
                this._router.navigate(['/dashboard']);
            }
            else {
                this.model.ValidationMessages = result.ValidationMessages;
            }
        });
    }
}