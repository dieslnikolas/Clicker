import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'web/app/services/user/user-login.service';

@Component({
  selector: 'app-shared-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

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
