/**
 * Login Component
 * 
 * INTERVIEW POINT: Demonstrates Reactive Forms with validation,
 * error handling, and JWT token storage flow.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="login-container">
      <div class="login-card">
        <h1>🎓 University Merch</h1>
        <h2>{{ isRegister ? 'Create Account' : 'Sign In' }}</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group" *ngIf="isRegister">
            <label for="username">Username</label>
            <input id="username" formControlName="username" type="text" placeholder="Enter username">
            <span class="error" *ngIf="form.get('username')?.touched && form.get('username')?.errors?.['required']">
              Username is required
            </span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" formControlName="email" type="email" placeholder="Enter email">
            <span class="error" *ngIf="form.get('email')?.touched && form.get('email')?.errors?.['email']">
              Please enter a valid email
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" formControlName="password" type="password" placeholder="Enter password">
            <span class="error" *ngIf="form.get('password')?.touched && form.get('password')?.errors?.['minlength']">
              Password must be at least 6 characters
            </span>
          </div>

          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" [disabled]="form.invalid || loading" class="btn-primary">
            {{ loading ? 'Please wait...' : (isRegister ? 'Register' : 'Login') }}
          </button>
        </form>

        <p class="toggle-text">
          {{ isRegister ? 'Already have an account?' : 'No account yet?' }}
          <a (click)="toggleMode()">{{ isRegister ? 'Sign In' : 'Register' }}</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    }
    .login-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
      width: 400px;
      color: #fff;
    }
    h1 { text-align: center; font-size: 1.8rem; margin-bottom: 8px; }
    h2 { text-align: center; font-size: 1.2rem; color: #aaa; margin-bottom: 24px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 6px; font-size: 0.9rem; color: #ccc; }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }
    input:focus { border-color: #7c3aed; }
    .error { color: #ff6b6b; font-size: 0.8rem; }
    .error-message { color: #ff6b6b; text-align: center; margin-bottom: 12px; }
    .btn-primary {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    .btn-primary:hover { opacity: 0.9; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .toggle-text { text-align: center; margin-top: 16px; color: #aaa; }
    .toggle-text a { color: #7c3aed; cursor: pointer; text-decoration: underline; }
  `]
})
export class LoginComponent {
    form: FormGroup;
    isRegister = false;
    loading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.form = this.fb.group({
            username: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    toggleMode() {
        this.isRegister = !this.isRegister;
        this.errorMessage = '';
        if (this.isRegister) {
            this.form.get('username')?.setValidators([Validators.required, Validators.minLength(3)]);
        } else {
            this.form.get('username')?.clearValidators();
        }
        this.form.get('username')?.updateValueAndValidity();
    }

    onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.errorMessage = '';

        const action$ = this.isRegister
            ? this.authService.register(this.form.value)
            : this.authService.login(this.form.value);

        action$.subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.error?.message || err.error?.message || 'Something went wrong';
            }
        });
    }
}
