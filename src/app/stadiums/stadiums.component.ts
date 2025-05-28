import { Component } from '@angular/core';

@Component({
  selector: 'app-stadiums',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Stadiums</h1>
      <p>This is the Stadiums page. Stadium listing will be displayed here.</p>
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
export class StadiumsComponent {}
