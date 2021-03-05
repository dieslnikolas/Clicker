import { Component, OnInit } from '@angular/core';
import { User } from 'web/app/providers/logged-user.service';
import { UserLoginService, UserLoginServiceInput } from '../../../services/user/user-login.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    model: User;

    constructor(private _userLoginService: UserLoginService, private _router: Router) { }

    ngOnInit(): void {
        this.model = this._userLoginService.tryLogin();
    }

    /**
     * Tries to loggin user
     */
    public LogIn(): void {

        let input = new UserLoginServiceInput();

        input.IsRemember = this.model.IsRemember;
        input.Password = this.model.Password;
        input.Server = this.model.Server;
        input.Username = this.model.Username;

        this._userLoginService.login(input).then(result =>{
            if (result.IsSuccess) {
                this._router.navigate(['/dashboard']);
            }
            else {
                this.model.ValidationMessages = result.ValidationMessages;
            }
        });
    }

}