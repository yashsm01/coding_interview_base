/**
 * Auth Guard
 * 
 * INTERVIEW POINT: This is Angular's route protection mechanism,
 * similar to .NET [Authorize] attribute on controller/action level.
 * - CanActivate: checks if user can access a route
 * - Redirects to login if not authenticated
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): boolean | UrlTree {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        // Redirect to login page
        return this.router.createUrlTree(['/login']);
    }
}
