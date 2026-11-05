
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { AppConfigService } from '../config/app-config.service';

@Injectable({ providedIn: 'root' })
export class LocationService {

  private get baseUrl() { return `${this.config.apiBaseUrl}/admin/locations`; }
  private platformId = inject(PLATFORM_ID);

  private locationSubject = new BehaviorSubject<any>(this.loadFromStorage());
  location$ = this.locationSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private config: AppConfigService
  ) {}

  
  getLocations() {
    return this.http.get<any[]>(this.baseUrl);
  }


  saveSelectedLocation(location: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
    }

    this.locationSubject.next(location);
  }

  
  getSelectedLocation() {
    return this.locationSubject.value;
  }

  
  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('selectedLocation');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  
  clearLocation() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('selectedLocation');
    }
    this.locationSubject.next(null);
  }
}