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
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create an Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter your email" type="email" required>
              <mat-error *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                Password must be at least 6 characters long
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword ? 'password' : 'text'" required>
              <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                Confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                <span *ngIf="!isLoading">Register</span>
                <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
    }
    
    .register-card {
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;
    
    const { email, password } = this.registerForm.value;
    this.isLoading = true;
    
    try {
      const success = await this.authService.register(email, password);
      if (success) {
        this.router.navigate(['/']);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
