import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../core/config/app-config.service';

@Component({
  selector: 'app-admin-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-location.html',
  styleUrl: './admin-location.css'
})
export class AdminLocation implements OnInit {

  city = '';
  area = '';
  landmark = '';
  fullAddress = '';
  state = '';
  pincode = '';

  locations: any[] = [];

  private get baseUrl() {
    return `${this.config.apiBaseUrl}/admin/locations`;
  }

  constructor(
    private http: HttpClient,
    private config: AppConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  addLocation(): void {

    const body = {
      city: this.city,
      area: this.area,
      landmark: this.landmark,
      fullAddress: this.fullAddress,
      state: this.state,
      pincode: this.pincode
    };

    this.http.post(this.baseUrl, body).subscribe({

      next: () => {

        alert('Location Added Successfully');

        this.resetForm();

        // Reload locations immediately
        this.loadLocations();

        this.cdr.markForCheck();
      },

      error: (err) => {

        console.error('Error adding location', err);

        this.cdr.markForCheck();

        alert('Error adding location');
      }
    });
  }

  loadLocations(): void {

    this.http.get<any[]>(this.baseUrl).subscribe({

      next: (res) => {

        this.locations = res ?? [];

        // Immediately update UI
        this.cdr.markForCheck();
      },

      error: (err) => {

        console.error('Error loading locations', err);

        this.locations = [];

        this.cdr.markForCheck();
      }
    });
  }

  deactivate(id: number): void {

    this.http
      .put(`${this.baseUrl}/deactivate/${id}`, {})
      .subscribe({

        next: () => {

          // Reload immediately after deactivation
          this.loadLocations();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error deactivating location', err);

          this.cdr.markForCheck();

          alert('Error deactivating location');
        }
      });
  }

  resetForm(): void {

    this.city = '';
    this.area = '';
    this.landmark = '';
    this.fullAddress = '';
    this.state = '';
    this.pincode = '';

    this.cdr.markForCheck();
  }
}