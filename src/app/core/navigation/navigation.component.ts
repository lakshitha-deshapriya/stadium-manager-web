import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService, NavItem } from '../services/navigation.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss', './auth-buttons.scss']
})
export class NavigationComponent implements OnInit {
  navItems$: Observable<NavItem[]>;
  isMobileMenuOpen = false;
  
  constructor(
    private navigationService: NavigationService,
    public authService: AuthService
  ) {
    this.navItems$ = this.navigationService.navItems$;
  }
  
  ngOnInit(): void {
    // You can dynamically add or update navigation items here if needed
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Close mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const navbarMenu = document.querySelector('.navbar-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (
      this.isMobileMenuOpen && 
      navbarMenu && 
      mobileMenuBtn && 
      !navbarMenu.contains(target) && 
      !mobileMenuBtn.contains(target)
    ) {
      this.isMobileMenuOpen = false;
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
