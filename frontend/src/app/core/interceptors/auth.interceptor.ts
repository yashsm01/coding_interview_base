/**
 * Auth Interceptor
 * 
 * INTERVIEW POINT: This is the Angular equivalent of .NET DelegatingHandler.
 * - Intercepts EVERY HTTP request
 * - Attaches JWT token to Authorization header
 * - Similar concept to Express auth middleware, but on client side
 */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (token) {
            const clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(clonedReq);
        }

        return next.handle(req);
    }
}
