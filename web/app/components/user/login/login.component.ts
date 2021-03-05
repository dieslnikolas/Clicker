import { Component, OnInit } from '@angular/core';
import { User } from 'web/app/providers/logged-user.service';
import { UserLoginService } from '../../../services/user/user-login.service'
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
        this.model = this._userLoginService.User ?? new User();
    }

    /**
     * Tries to loggin user
     */
    public LogIn(): void {
        this._userLoginService.Login(this.model).then(result =>{
            if (result.IsSuccess) {
                this._router.navigate(['/dashboard']);
            }
            else {
                this.model.ValidationMessages = result.ValidationMessages;
            }
        });
    }

}