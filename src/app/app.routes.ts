import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StadiumsComponent } from './stadiums/stadiums.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stadiums', component: StadiumsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
