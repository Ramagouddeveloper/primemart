import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DeliveryLocationService } from '../../core/services/delivery-location.service';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-selector.html',
  styleUrl: './location-selector.css'
})
export class LocationSelector implements OnInit, OnDestroy {

  locations: any[] = [];
  selectedLocation: any | null = null;

  @Output() locationSelected = new EventEmitter<any>();

  private subscription?: Subscription;

  constructor(private deliveryLocationService: DeliveryLocationService) {}

  ngOnInit(): void {
    this.selectedLocation = this.deliveryLocationService.getSelectedLocation();

    this.subscription = this.deliveryLocationService.getLocations().subscribe({
      next: locations => {
        this.locations = locations ?? [];

        if (this.selectedLocation) {
          this.selectedLocation = this.locations.find(
            location => Number(location.id) === Number(this.selectedLocation.id)
          ) ?? null;
        }

        if (!this.selectedLocation && this.locations.length > 0) {
          this.selectLocation(this.locations[0]);
        }
      },
      error: error => console.error('Location selector error:', error)
    });
  }

  selectLocation(location: any): void {
    if (!location) {
      return;
    }

    this.selectedLocation = location;
    this.deliveryLocationService.saveSelectedLocation(location);
    this.locationSelected.emit(location);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
