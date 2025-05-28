import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StadiumsComponent } from './stadiums/stadiums.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stadiums', component: StadiumsComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
