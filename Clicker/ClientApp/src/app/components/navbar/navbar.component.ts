import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/user/user-login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _userLoginService: UserLoginService, private _router: Router) { }

  ngOnInit(): void {
  }

  /**
     * Tries to loggin user
     */
   public LogOut(): void {
    this._userLoginService.logout().then(() => {
        this._router.navigate(["/login"]);
    })
}

}
