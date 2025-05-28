import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';

export interface Booking {
  id?: string;
  userId: string;
  venue: string;  // 'cricket' or 'football'
  date: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly BOOKINGS_COLLECTION = 'bookings';
  private readonly VENUES_COLLECTION = 'venues';

  constructor(private firebaseService: FirebaseService) {}

  // Get all bookings for a specific user
  getUserBookings(userId: string): Observable<Booking[]> {
    return this.firebaseService.getCollection<Booking>(`${this.BOOKINGS_COLLECTION}`);
  }

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
    const newBooking = {
      ...booking,
      createdAt: new Date()
    };
    
    return this.firebaseService.addDocument(this.BOOKINGS_COLLECTION, newBooking);
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<void> {
    return this.firebaseService.updateDocument(
      this.BOOKINGS_COLLECTION, 
      bookingId, 
      { status }
    );
  }

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<void> {
    return this.updateBookingStatus(bookingId, 'cancelled');
  }

  // Check availability for a specific venue and date
  async checkAvailability(venue: string, date: Date): Promise<TimeSlot[]> {
    // First, get all the time slots
    const timeSlots: TimeSlot[] = [
      { id: '1', startTime: '9:00 AM', endTime: '10:00 AM', isAvailable: true },
      { id: '2', startTime: '10:00 AM', endTime: '11:00 AM', isAvailable: true },
      { id: '3', startTime: '11:00 AM', endTime: '12:00 PM', isAvailable: true },
      { id: '4', startTime: '12:00 PM', endTime: '1:00 PM', isAvailable: true },
      { id: '5', startTime: '1:00 PM', endTime: '2:00 PM', isAvailable: true },
      { id: '6', startTime: '2:00 PM', endTime: '3:00 PM', isAvailable: true }
    ];
    
    // Format date to YYYY-MM-DD for comparison
    const formattedDate = this.formatDate(date);
    
    try {
      // Get all bookings for the selected venue and date
      const bookings = await this.firebaseService.queryCollection<Booking>(
        this.BOOKINGS_COLLECTION, 
        'venue', 
        '==', 
        venue
      );
      
      const bookedSlots = bookings.filter(booking => {
        // Compare only the date part (not time)
        const bookingDate = this.formatDate(booking.date instanceof Date ? booking.date : new Date(booking.date));
        return bookingDate === formattedDate && booking.status !== 'cancelled';
      });
      
      // Mark booked time slots as unavailable
      bookedSlots.forEach(booking => {
        const timeSlot = timeSlots.find(slot => 
          `${slot.startTime} - ${slot.endTime}` === booking.timeSlot
        );
        
        if (timeSlot) {
          timeSlot.isAvailable = false;
        }
      });
      
      return timeSlots;
    } catch (error) {
      console.error('Error checking availability:', error);
      return timeSlots; // Return all as available if there's an error
    }
  }
  
  // Helper method to format date to YYYY-MM-DD
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
