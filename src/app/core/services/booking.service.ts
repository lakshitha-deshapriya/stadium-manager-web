import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';

// Firestore Timestamp interface
interface Timestamp {
    seconds: number;
    nanoseconds: number;
}

export interface Booking {
    id?: string;
    userId: string;
    venue: string;  // 'cricket' or 'football'
    date: Date | Timestamp | any; // Can be Date, Firestore Timestamp, or string
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date | Timestamp | any; // Can be Date, Firestore Timestamp, or string
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

    constructor(private firebaseService: FirebaseService) { }

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
        console.log('checkAvailability');

        const timeSlots: TimeSlot[] = [
            { id: '1', startTime: '9:00 AM', endTime: '10:00 AM', isAvailable: true },
            { id: '2', startTime: '10:00 AM', endTime: '11:00 AM', isAvailable: true },
            { id: '3', startTime: '11:00 AM', endTime: '12:00 PM', isAvailable: true },
            { id: '4', startTime: '12:00 PM', endTime: '1:00 PM', isAvailable: true },
            { id: '5', startTime: '1:00 PM', endTime: '2:00 PM', isAvailable: true },
            { id: '6', startTime: '2:00 PM', endTime: '3:00 PM', isAvailable: true }
        ];

        const formattedDate = this.formatDate(date);

        try {
            console.log('fetching-bookings');
            let bookings: Booking[] = [];

            const isLoggedIn = this.firebaseService.auth.currentUser !== null;

            try {
                bookings = await this.firebaseService.queryCollection<Booking>(
                    this.BOOKINGS_COLLECTION,
                    'venue',
                    '==',
                    venue
                );
            } catch (error: any) {
                if (error?.code === 'permission-denied') {
                    console.warn('Permission denied when fetching bookings. User may need to sign in or lacks proper permissions.');
                } else {
                    throw error;
                }
            }

            console.log('fetching-bookings');

            const bookedSlots = bookings.filter(booking => {
                try {
                    // Safe conversion of booking date
                    let bookingDateObj: Date;

                    if (booking.date instanceof Date) {
                        bookingDateObj = booking.date;
                    }
                    // Handle Firestore Timestamp objects (which have seconds and nanoseconds properties)
                    else if (booking.date && typeof booking.date === 'object' && 'seconds' in booking.date && 'nanoseconds' in booking.date) {
                        // Convert Firestore Timestamp to Date
                        const timestamp = booking.date as Timestamp;
                        bookingDateObj = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    }
                    else {
                        // Try to safely convert to a Date object
                        try {
                            bookingDateObj = new Date(booking.date);
                        } catch (e) {
                            console.warn('Invalid date format in booking:', booking);
                            return false; // Skip this booking
                        }
                    }

                    // Check if the date is valid
                    if (isNaN(bookingDateObj.getTime())) {
                        console.warn('Invalid date object in booking:', booking);
                        return false; // Skip this booking
                    }

                    // Compare only the date part (not time)
                    const bookingDate = this.formatDate(bookingDateObj);
                    return bookingDate === formattedDate && booking.status !== 'cancelled';
                } catch (error) {
                    console.error('Error processing booking date:', error, booking);
                    return false; // Skip this booking on error
                }
            });

            // Mark booked time slots as unavailable
            console.log('marking-unavailable-slots');
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
        try {
            // Validate if date is valid before trying to convert
            if (!(date instanceof Date) || isNaN(date.getTime())) {
                console.warn('Invalid date encountered in formatDate:', date);
                return '';
            }
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error, date);
            return '';
        }
    }
}
