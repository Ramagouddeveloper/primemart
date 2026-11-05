import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { AppConfigService } from '../config/app-config.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly config = inject(AppConfigService);
  private categoriesCache: any[] | null = null;
  private categoriesRequest$: Observable<any[]> | null = null;
  private readonly productCache = new Map<number, any[]>();
  private readonly productRequests = new Map<number, Observable<any[]>>();

  constructor(private http: HttpClient) {}
  private get baseUrl(): string { return `${this.config.apiBaseUrl}/practice/products`; }

  fetchCategories(): Observable<any[]> {
    if (this.categoriesCache) return of(this.categoriesCache);
    if (this.categoriesRequest$) return this.categoriesRequest$;
    this.categoriesRequest$ = this.http.get<any[]>(`${this.baseUrl}/fetchcategories`).pipe(
      tap(data => this.categoriesCache = data ?? []),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    return this.categoriesRequest$;
  }

  fetchProducts(locationId: number): Observable<any[]> {
    if (this.productCache.has(locationId)) return of(this.productCache.get(locationId)!);
    const existing = this.productRequests.get(locationId);
    if (existing) return existing;
    const request$ = this.http.get<any[]>(`${this.baseUrl}/fetchproducts?locationId=${locationId}`).pipe(
      tap(data => { this.productCache.set(locationId, data ?? []); this.productRequests.delete(locationId); }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.productRequests.set(locationId, request$);
    return request$;
  }

  clearProductCache(locationId?: number): void {
    if (locationId == null) this.productCache.clear(); else this.productCache.delete(locationId);
  }
}
