import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Contact Us</h1>
      <p>Get in touch with our team for any questions or inquiries.</p>
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
export class ContactComponent {}
