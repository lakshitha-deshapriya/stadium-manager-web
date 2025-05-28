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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService, TimeSlot } from '../core/services/booking.service';
import { FirebaseService } from '../core/services/firebase.service';

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
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
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
  timeSlots: TimeSlot[] = [];
  selectedTimeSlot: string | null = null;
  isLoading: boolean = false;
  
  constructor(
    private bookingService: BookingService,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Set initial date to today
    this.selectedDate = new Date();
    // Initially load time slots for today
    this.searchAvailability();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    console.log('Selected date:', this.selectedDate);
  }

  onVenueChange(event: any): void {
    this.selectedVenue = event.value;
    console.log('Selected venue:', this.selectedVenue);
    // Reset selected time slot when venue changes
    this.selectedTimeSlot = null;
  }

  async searchAvailability(): Promise<void> {
    this.isLoading = true;
    try {
      console.log('Searching availability for:');
      console.log('Venue:', this.selectedVenue);
      console.log('Date:', this.selectedDate);
      
      this.timeSlots = await this.bookingService.checkAvailability(
        this.selectedVenue, 
        this.selectedDate
      );
      
      // Reset selected time slot
      this.selectedTimeSlot = null;
    } catch (error) {
      console.error('Error fetching availability:', error);
      this.snackBar.open('Failed to fetch availability. Please try again.', 'Close', {
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }
  
  selectTimeSlot(slot: TimeSlot): void {
    if (!slot.isAvailable) return;
    
    this.selectedTimeSlot = `${slot.startTime} - ${slot.endTime}`;
  }
  
  async confirmBooking(): Promise<void> {
    if (!this.selectedTimeSlot) {
      this.snackBar.open('Please select a time slot first', 'Close', {
        duration: 3000
      });
      return;
    }
    
    try {
      // Check if user is authenticated
      const user = this.firebaseService.user$;
      
      if (!user) {
        this.snackBar.open('Please sign in to book a slot', 'Close', {
          duration: 3000
        });
        // TODO: Redirect to login page or open login dialog
        return;
      }
      
      // Create booking
      await this.bookingService.createBooking({
        userId: 'user123', // Replace with actual user ID when auth is implemented
        venue: this.selectedVenue,
        date: this.selectedDate,
        timeSlot: this.selectedTimeSlot,
        status: 'pending'
      });
      
      this.snackBar.open('Booking confirmed!', 'Close', {
        duration: 3000
      });
      
      // Refresh availability
      this.searchAvailability();
    } catch (error) {
      console.error('Error confirming booking:', error);
      this.snackBar.open('Failed to confirm booking. Please try again.', 'Close', {
        duration: 3000
      });
    }
  }
}
