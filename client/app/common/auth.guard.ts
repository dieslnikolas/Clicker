import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/user/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    
    constructor(private router: Router, private authenticationService: LoginService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const currentUser = this.authenticationService.currentUserValue;
        
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