/**
 * Error Interceptor
 * 
 * INTERVIEW POINT: Global error handling on HTTP layer.
 * Catches 401 → auto-logout, other errors → show notification.
 */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        // Token expired or invalid → redirect to login
                        this.authService.logout();
                        this.router.navigate(['/login']);
                        break;
                    case 403:
                        console.error('Access forbidden');
                        break;
                    case 404:
                        console.error('Resource not found');
                        break;
                    case 500:
                        console.error('Server error');
                        break;
                }
                return throwError(() => error);
            })
        );
    }
}
