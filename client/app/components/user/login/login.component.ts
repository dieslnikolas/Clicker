import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/user/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  model = {
    currentYear: 2021,
    server: null,
    user: null,
    password: null,
    isRemember: true
  }

  constructor(private loginService: LoginService) {
  }

  /**
   * Tries to loggin user
   */
  public LogIn(): void {
    this.loginService.login(this.model.server, this.model.user, this.model.password);

    console.log(this.loginService.currentUserValue);
  }

}