import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  selectedDate: Date = new Date();
  selectedVenue: string = 'cricket'; // Default to cricket stadium
  venues: { value: string, viewValue: string }[] = [
    {value: 'cricket', viewValue: 'Cricket Stadium'},
    {value: 'football', viewValue: 'Football Stadium'}
  ];
  
  constructor() {}
  
  ngOnInit(): void {
    // Set initial date to today
    this.selectedDate = new Date();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    // Here you would typically update the calendar view based on the selected date
    console.log('Selected date:', this.selectedDate);
  }

  onVenueChange(event: any): void {
    this.selectedVenue = event.value;
    console.log('Selected venue:', this.selectedVenue);
    // Here you would update the available time slots based on the selected venue
  }

  searchAvailability(): void {
    console.log('Searching availability for:');
    console.log('Venue:', this.selectedVenue);
    console.log('Date:', this.selectedDate);
    
    // Here you would call a service to fetch available time slots
    // based on the selected venue and date
    alert(`Searching for available slots at ${this.selectedVenue === 'cricket' ? 'Cricket Stadium' : 'Football Stadium'} on ${this.selectedDate.toLocaleDateString()}`);
  }
}
