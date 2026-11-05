import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppConfigService } from '../../core/config/app-config.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {

  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];
  orderItems: any[] = [];
  selectedOrderId: number | null = null;

  private get baseUrl() {
    return `${this.config.apiBaseUrl}/admin/orders`;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.http.get<any[]>(this.baseUrl)
      .subscribe({

        next: (data) => {

          this.orders = data ?? [];

          // Immediately update UI
          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error loading orders', err);

          this.orders = [];

          // Immediately update UI
          this.cdr.markForCheck();
        }
      });
  }

  viewItems(orderId: number): void {

    // Close currently opened order
    if (this.selectedOrderId === orderId) {

      this.selectedOrderId = null;
      this.orderItems = [];

      this.cdr.markForCheck();

      return;
    }

    this.selectedOrderId = orderId;
    this.orderItems = [];

    // Update UI immediately to show selected/loading state
    this.cdr.markForCheck();

    this.http.get<any[]>(`${this.baseUrl}/${orderId}/items`)
      .subscribe({

        next: (data) => {

          this.orderItems = data ?? [];

          // Immediately display items
          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error loading order items', err);

          this.orderItems = [];

          this.cdr.markForCheck();
        }
      });
  }

  acceptOrder(orderId: number): void {

    this.http.put(`${this.baseUrl}/${orderId}/accept`, {})
      .subscribe({

        next: () => {

          this.loadOrders();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error accepting order', err);

          this.cdr.markForCheck();
        }
      });
  }

  shipOrder(orderId: number): void {

    this.http.put(`${this.baseUrl}/${orderId}/ship`, {})
      .subscribe({

        next: () => {

          this.loadOrders();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error shipping order', err);

          this.cdr.markForCheck();
        }
      });
  }

  outForDelivery(orderId: number): void {

    this.http.put(`${this.baseUrl}/${orderId}/out`, {})
      .subscribe({

        next: () => {

          this.loadOrders();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error updating order to out for delivery', err);

          this.cdr.markForCheck();
        }
      });
  }

  deliverOrder(orderId: number): void {

    this.http.put(`${this.baseUrl}/${orderId}/deliver`, {})
      .subscribe({

        next: () => {

          this.loadOrders();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error delivering order', err);

          this.cdr.markForCheck();
        }
      });
  }

  updateStatus(orderId: number, status: string): void {

    this.http.put(`${this.baseUrl}/${orderId}/status`, {
      status: status
    })
      .subscribe({

        next: () => {

          this.loadOrders();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error updating order', err);

          this.cdr.markForCheck();
        }
      });
  }

  isAccepted(order: any): boolean {
    return order.status === 'ACCEPTED';
  }

  isShipped(order: any): boolean {
    return order.status === 'SHIPPED';
  }

  isOut(order: any): boolean {
    return order.status === 'OUT_FOR_DELIVERY';
  }
}