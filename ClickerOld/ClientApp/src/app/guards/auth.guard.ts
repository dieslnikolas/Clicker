import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../providers/autehentication.service';
import { UserLoginService } from './../services/user/user-login.service';

/**
 * Check authorize parameter
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router, private _loggedUserService: AuthenticationService) { }

    /**
     * Tries to define if user is logged
     * @param route current url
     * @param state requested url
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return false;

        // Is logged in
        if (this._loggedUserService.user.isLogged == true) {
            // logged in so return true
            return true;
        }

        // is not logged, redirect to login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}