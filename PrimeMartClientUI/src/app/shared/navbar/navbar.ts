import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/CartService';
import { DeliveryLocationService } from '../../core/services/delivery-location.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly deliveryLocationService = inject(DeliveryLocationService);

  cartCount = 0;
  locations: any[] = [];
  selectedLocation: any | null = null;
  showLocationDropdown = false;

  private cartSubscription?: Subscription;
  private locationSubscription?: Subscription;

  ngOnInit(): void {
    this.selectedLocation = this.deliveryLocationService.getSelectedLocation();

    if (this.auth.isLoggedIn()) {
      this.cartService.loadCartCount();
      this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count ?? 0;
      });
    }

    this.locationSubscription = this.deliveryLocationService.getLocations().subscribe({
      next: locations => {
        this.locations = locations ?? [];

        if (this.selectedLocation) {
          const saved = this.locations.find(
            location => Number(location.id) === Number(this.selectedLocation.id)
          );

          if (saved) {
            this.selectedLocation = saved;
            this.deliveryLocationService.saveSelectedLocation(saved);
            return;
          }
        }

        if (this.locations.length > 0) {
          this.selectedLocation = this.locations[0];
          this.deliveryLocationService.saveSelectedLocation(this.selectedLocation);
        }
      },
      error: error => console.error('Navbar locations error:', error)
    });
  }

  toggleLocationDropdown(event?: Event): void {
    event?.stopPropagation();
    this.showLocationDropdown = !this.showLocationDropdown;
  }

  selectLocation(location: any, event?: Event): void {
    event?.stopPropagation();

    if (!location) {
      return;
    }

    this.selectedLocation = location;
    this.deliveryLocationService.saveSelectedLocation(location);
    this.showLocationDropdown = false;
  }

  logout(): void {
    this.auth.logout();
    this.cartCount = 0;
    this.showLocationDropdown = false;
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.locationSubscription?.unsubscribe();
  }
}
