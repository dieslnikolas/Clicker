import { Component, OnInit } from '@angular/core';
import { UserLoginService, UserLoginServiceInput } from '../../../services/user/user-login.service'
import { Router } from '@angular/router'
import { BasePage } from "../../base-page.component";
import { User } from 'src/app/providers/autehentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BasePage<User> implements OnInit {

    constructor(private _userLoginService: UserLoginService, private _router: Router) {
        super();
    }

    ngOnInit(): void {

        // try if autologin is enabled 
        this._userLoginService.checkPersistentLogin().then(result => {

            // user is logged
            if (result.isSuccess) {
                this._router.navigate(['/dashboard']);
            }

            // declare new model
            this.setModel(new User());
            //this.setModel(result.data);
        });
    }

    /**
     * Try to login user
     */
    onLogin() {

        //let input = new UserLoginServiceInput();

        //input.isRemember = this.pageModel.isSuccess;
        //input.password = this.pageModel.data.password;
        //input.server = this.pageModel.data.server;
        //input.username = this.pageModel.data.username;

        //this._userLoginService.login(input).then(result => {
        //    // is logged in
        //    if (result.isSuccess) {
        //        this._router.navigate(['/dashboard']);
        //    }

        //    // validation errors
        //    this.pageModel.validationMessages = result.validationMessages;
        //    this.handle();
        //});
    }
}