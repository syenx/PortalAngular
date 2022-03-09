import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular'

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {
    constructor(private _msalService: MsalService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable< boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const userRoles = (this._msalService.getAccount().idToken as any).roles;
        const allowedRoles = route.data["roles"];
        const matchingRoles = userRoles.filter(x => allowedRoles.includes(x));
        return matchingRoles.length > 0;
    }
}