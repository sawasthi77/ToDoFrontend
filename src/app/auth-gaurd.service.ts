import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "../../node_modules/@angular/router";
import { Observable } from "../../node_modules/rxjs";
import { Injectable } from "../../node_modules/@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate {
constructor(private authService: AuthService, private router: Router) {}

canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
        let authToken = localStorage.getItem('authToken');
                    if(authToken === undefined || authToken === '' || authToken === null) {
                        this.router.navigate(['/']);
                        return false;
                    } else {

                        return true;
                    }
    }
}