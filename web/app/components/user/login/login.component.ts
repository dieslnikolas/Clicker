import { Component, OnInit } from '@angular/core';
import { UserLoginInput, UserLoginService } from '../../../services/user/user-login.service'

@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    model: UserLoginInput;

    constructor(private _userLoginService: UserLoginService) { }

    ngOnInit(): void {
        this.model = new UserLoginInput();
    }

    /**
     * Tries to loggin user
     */
    public LogIn(): void {
        this._userLoginService.Login(this.model);
    }

}