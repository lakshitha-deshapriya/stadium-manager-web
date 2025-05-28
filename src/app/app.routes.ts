import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StadiumsComponent } from './stadiums/stadiums.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { map } from 'rxjs/operators';

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn().pipe(
    map(isLoggedIn => isLoggedIn ? true : { path: '/login' })
  );
};

// Public pages guard - redirect to home if already logged in
const publicPagesGuard = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn().pipe(
    map(isLoggedIn => isLoggedIn ? { path: '/' } : true)
  );
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stadiums', component: StadiumsComponent },
  { path: 'bookings', component: BookingsComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent, canActivate: [publicPagesGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [publicPagesGuard] },
  { path: '**', redirectTo: '' }
];
