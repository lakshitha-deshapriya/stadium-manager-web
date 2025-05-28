import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stadiums',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stadiums-container">
      <h1>Stadiums</h1>
      <div class="stadiums-grid">
        <div class="stadium-card" *ngFor="let stadium of stadiums">
          <div class="stadium-image" [style.backgroundImage]="'url(' + stadium.image + ')'"></div>
          <div class="stadium-details">
            <h3>{{stadium.name}}</h3>
            <p class="stadium-location">{{stadium.location}}</p>
            <p class="stadium-capacity">Capacity: {{stadium.capacity}}</p>
            <button class="view-details-btn">View Details</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stadiums-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }
    
    .stadiums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .stadium-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background-color: white;
    }
    
    .stadium-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .stadium-image {
      height: 180px;
      background-size: cover;
      background-position: center;
    }
    
    .stadium-details {
      padding: 1.5rem;
    }
    
    .stadium-details h3 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }
    
    .stadium-location {
      color: #666;
      margin-bottom: 0.5rem;
    }
    
    .stadium-capacity {
      color: #888;
      margin-bottom: 1.2rem;
      font-size: 0.9rem;
    }
    
    .view-details-btn {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .view-details-btn:hover {
      background-color: #2980b9;
    }
    
    @media (max-width: 768px) {
      .stadiums-container {
        padding: 1.5rem;
      }
      
      .stadiums-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StadiumsComponent {
  stadiums = [
    {
      id: 1,
      name: 'Olympic Stadium',
      location: 'London, UK',
      capacity: '80,000',
      image: 'https://images.unsplash.com/photo-1577224682124-d50ec8724df4?w=800&auto=format'
    },
    {
      id: 2,
      name: 'Camp Nou',
      location: 'Barcelona, Spain',
      capacity: '99,354',
      image: 'https://images.unsplash.com/photo-1583296903261-4fe72335467b?w=800&auto=format'
    },
    {
      id: 3,
      name: 'Wembley Stadium',
      location: 'London, UK',
      capacity: '90,000',
      image: 'https://images.unsplash.com/photo-1550576037-9eb233cb3703?w=800&auto=format'
    },
    {
      id: 4,
      name: 'Santiago Bernabeu',
      location: 'Madrid, Spain',
      capacity: '81,044',
      image: 'https://images.unsplash.com/photo-1595030044556-caed2429cf77?w=800&auto=format'
    }
  ];
}
