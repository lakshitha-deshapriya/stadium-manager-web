import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Events</h1>
      <p>This is the Events page. Event listings will be displayed here.</p>
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
export class EventsComponent {}
