import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>About</h1>
      <p>This is the About page for Stadium Manager application.</p>
      <p>Stadium Manager is a comprehensive platform for managing stadium operations, events, and ticketing.</p>
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
export class AboutComponent {}
