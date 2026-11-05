import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { AuthService } from './auth.service';
import { AppConfigService } from '../config/app-config.service';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly config = inject(AppConfigService);

  private readonly cartCountSubject =
    new BehaviorSubject<number>(0);

  readonly cartCount$ =
    this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private get baseUrl(): string {
    return `${this.config.apiBaseUrl}/cart`;
  }

  addToCart(productId: number, quantity: number, _locationId?: number) {
    return this.http.post(`${this.baseUrl}/add`, {
      username: this.auth.getUsername(),
      productId,
      quantity
    });
  }

  loadCartCount(): void {
    const username = this.auth.getUsername();

    if (!username) {
      this.cartCountSubject.next(0);
      return;
    }

    this.http
      .get<any>(`${this.baseUrl}/count/${encodeURIComponent(username)}`)
      .subscribe({
        next: res => {
          this.cartCountSubject.next(Number(res?.count ?? 0));
        },
        error: err => {
          console.error('Cart count error:', err);
          this.cartCountSubject.next(0);
        }
      });
  }

  getCartItems() {
    const username = this.auth.getUsername();

    if (!username) {
      return EMPTY;
    }

    return this.http.get<any[]>(
      `${this.baseUrl}/items/${encodeURIComponent(username)}`
    );
  }

  clearCart() {
    const username = this.auth.getUsername();

    if (!username) {
      return EMPTY;
    }

    return this.http.delete(
      `${this.baseUrl}/clear/${encodeURIComponent(username)}`
    );
  }
}
