import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { AppConfigService } from '../config/app-config.service';

/** Owns the customer's delivery location. This is independent from product filtering location. */
@Injectable({ providedIn: 'root' })
export class DeliveryLocationService {
  private readonly config = inject(AppConfigService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'deliveryLocation';

  private readonly selectedSubject = new BehaviorSubject<any | null>(this.loadFromStorage());
  readonly selectedLocation$ = this.selectedSubject.asObservable();

  private locationsCache: any[] | null = null;
  private locationsRequest$: Observable<any[]> | null = null;

  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
    return `${this.config.apiBaseUrl}/locations`;
  }

  getLocations(): Observable<any[]> {
    if (this.locationsCache !== null) return of(this.locationsCache);
    if (this.locationsRequest$) return this.locationsRequest$;

    this.locationsRequest$ = this.http.get<any[]>(this.baseUrl).pipe(
      tap(locations => this.locationsCache = locations ?? []),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    return this.locationsRequest$;
  }

  getSelectedLocation(): any | null {
    return this.selectedSubject.value;
  }

  saveSelectedLocation(location: any): void {
    if (!location) return;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(location));
    }
    this.selectedSubject.next(location);
  }

  clearLocation(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.storageKey);
    this.selectedSubject.next(null);
  }

  private loadFromStorage(): any | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const value = localStorage.getItem(this.storageKey);
    if (!value) return null;
    try { return JSON.parse(value); }
    catch { localStorage.removeItem(this.storageKey); return null; }
  }
}
