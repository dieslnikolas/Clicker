import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggedUserService } from '../providers/logged-user.service';
import { UserLoginService } from './../services/user/user-login.service';

/**
 * Check authorize parameter
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router, private _loggedUserService: LoggedUserService) { }

    /**
     * Tries to define if user is logged
     * @param route current url
     * @param state requested url
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // Is logged in
        if (this._loggedUserService.user.IsLogged) {
            // logged in so return true
            return true;
        }

        // is not logged, redirect to login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}