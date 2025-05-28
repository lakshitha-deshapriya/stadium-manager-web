import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login to Stadium Finder</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter your email" type="email" required>
              <mat-error *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading">
                <span *ngIf="!isLoading">Login</span>
                <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    
    button[type="submit"] {
      min-width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 0 1rem 1rem;
    }
    
    a {
      color: #3498db;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;
    
    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    
    try {
      const success = await this.authService.login(email, password);
      if (success) {
        this.router.navigate(['/']);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
