import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'web/app/services/user/user-login.service';

@Component({
  selector: 'app-shared-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

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
