import { Component, OnInit } from '@angular/core';
import { UserLoginInput, UserLoginService } from '../../../services/user/user-login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model: UserLoginInput;

  constructor(private _loginService: UserLoginService) {  }

  ngOnInit(): void {
      this.model = new UserLoginInput();
  }

  /**
   * Tries to loggin user
   */
  public LogIn(): void {
    this._loginService.Login(this.model);
    console.log(this._loginService.User);
  }

}