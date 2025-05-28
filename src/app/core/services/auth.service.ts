import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Transform the firebase user into our custom User type
    this.user$ = this.firebaseService.user$.pipe(
      map(user => {
        if (user) {
          return {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified
          };
        } else {
          return null;
        }
      })
    );
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await this.firebaseService.signIn(email, password);
      this.snackBar.open('Successfully logged in', 'Close', { duration: 3000 });
      return true;
    } catch (error: any) {
      console.error('Error logging in', error);
      let errorMessage = 'Failed to login. Please try again.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'User not found. Please check your email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid login credentials. Please try again.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
        }
      }
      
      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      return false;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      await this.firebaseService.signUp(email, password);
      this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
      return true;
    } catch (error: any) {
      console.error('Error registering user:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already in use. Try logging in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address. Please enter a valid email.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use a stronger password.';
            break;
        }
      }
      
      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.firebaseService.signOut();
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }
}
