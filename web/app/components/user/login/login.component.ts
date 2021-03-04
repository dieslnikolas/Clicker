import { Component, OnInit } from '@angular/core';
import { User } from 'web/app/providers/logged-user.service';
import { UserLoginService } from '../../../services/user/user-login.service'

@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    model: User;

    constructor(private _userLoginService: UserLoginService) { }

    ngOnInit(): void {
        this.model = new User();
    }

    /**
     * Tries to loggin user
     */
    public LogIn(): void {
        this._userLoginService.Login(this.model).then(result =>{
            if (result.IsSuccess) {
                console.log('You are in');
            }
            else {
                this.model.ValidationMessages = result.ValidationMessages;
            }
        });
    }

}