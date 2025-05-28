import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _navItems = new BehaviorSubject<NavItem[]>([
    { label: 'Home', path: '/' },
    { label: 'Stadiums', path: '/stadiums' },
    { label: 'Bookings', path: '/bookings' },
    { label: 'Contact', path: '/contact' }
  ]);

  get navItems$(): Observable<NavItem[]> {
    return this._navItems.asObservable();
  }

  get navItems(): NavItem[] {
    return this._navItems.getValue();
  }

  updateNavItems(items: NavItem[]): void {
    this._navItems.next(items);
  }

  addNavItem(item: NavItem): void {
    const currentItems = this._navItems.getValue();
    this._navItems.next([...currentItems, item]);
  }

  removeNavItem(path: string): void {
    const currentItems = this._navItems.getValue();
    this._navItems.next(currentItems.filter(item => item.path !== path));
  }
}
