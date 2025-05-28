import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Bookings</h1>
      <p>Manage your stadium bookings here.</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem 0;
    }
    
    h1 {
      margin-bottom: 1rem;
    }
  `]
})
export class BookingsComponent {}
