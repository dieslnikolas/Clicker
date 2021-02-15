import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserLoginService } from '../services/user/user-login.service';

/**
 * Check authorize parameter
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router, private _userLoginService: UserLoginService) { }

    /**
     * Tries to define if user is logged
     * @param route current url
     * @param state requested url
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // loads info about current user
        const currentUser = this._userLoginService.currentUserValue;
        
        // Is logged in
        if (currentUser) {
            // logged in so return true
            return true;
        }

        // is not is bullshitter
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}