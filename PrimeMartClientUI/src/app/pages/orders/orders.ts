import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { AppConfigService } from '../../core/config/app-config.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit, OnDestroy {

  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly config = inject(AppConfigService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly baseUrl = this.config.apiBaseUrl;

  orders: any[] = [];
  orderItems: any[] = [];

  selectedOrderId: number | null = null;

  loadingOrders = false;
  loadingItems = false;
  cancellingOrderId: number | null = null;

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private ordersRequestRunning = false;

  ngOnInit(): void {

    /*
     * Load orders immediately when page opens.
     */
    this.loadOrders();

    /*
     * Automatically refresh orders every 5 seconds.
     *
     * This means when an order is placed or its status
     * changes, the customer page gets the latest data.
     */
    this.intervalId = setInterval(() => {

      if (!this.ordersRequestRunning) {
        this.loadOrders();
      }

    }, 5000);
  }

  ngOnDestroy(): void {

    if (this.intervalId !== null) {

      clearInterval(this.intervalId);

      this.intervalId = null;
    }
  }

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  loadOrders(): void {

    const username =
      this.auth.getUsername();

    if (!username) {

      this.orders = [];

      this.loadingOrders = false;

      this.cdr.markForCheck();

      return;
    }

    this.ordersRequestRunning = true;

    this.loadingOrders = true;

    /*
     * Tell Angular that loading state changed.
     */
    this.cdr.markForCheck();

    this.http
      .get<any[]>(
        `${this.baseUrl}/orders/user/${encodeURIComponent(username)}`
      )
      .subscribe({

        next: data => {

          console.log(
            'Orders loaded:',
            data
          );

          this.orders =
            data ?? [];

          this.loadingOrders = false;

          this.ordersRequestRunning = false;

          /*
           * Important for zoneless Angular.
           *
           * This makes the orders appear immediately
           * on the first click.
           */
          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Orders loading error:',
            err
          );

          this.orders = [];

          this.loadingOrders = false;

          this.ordersRequestRunning = false;

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // ORDER ITEMS
  // =========================================================

  toggleItems(
    orderId: number
  ): void {

    /*
     * Close currently opened order.
     */
    if (
      this.selectedOrderId === orderId
    ) {

      this.selectedOrderId = null;

      this.orderItems = [];

      this.loadingItems = false;

      this.cdr.markForCheck();

      return;
    }

    /*
     * Open selected order.
     */
    this.selectedOrderId =
      orderId;

    this.orderItems = [];

    this.loadingItems = true;

    this.cdr.markForCheck();

    this.http
      .get<any[]>(
        `${this.baseUrl}/orders/${orderId}/items`
      )
      .subscribe({

        next: data => {

          this.orderItems =
            data ?? [];

          this.loadingItems = false;

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Order items loading error:',
            err
          );

          this.orderItems = [];

          this.loadingItems = false;

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // CANCEL ORDER
  // =========================================================

  cancelOrder(
    orderId: number
  ): void {

    /*
     * Prevent multiple cancel requests.
     */
    if (
      this.cancellingOrderId !== null
    ) {
      return;
    }

    if (
      !confirm(
        'Are you sure you want to cancel this order?'
      )
    ) {
      return;
    }

    this.cancellingOrderId =
      orderId;

    this.cdr.markForCheck();

    this.http
      .put(
        `${this.baseUrl}/orders/${orderId}/cancel`,
        {}
      )
      .subscribe({

        next: () => {

          this.cancellingOrderId =
            null;

          /*
           * Reload immediately after cancellation.
           */
          this.loadOrders();

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Cancel order error:',
            err
          );

          this.cancellingOrderId =
            null;

          alert(
            err?.error?.message ||
            'Unable to cancel the order.'
          );

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // IMAGE
  // =========================================================

  getImage(
    image: unknown
  ): string {

    if (!image) {

      return 'assets/no-image.svg';
    }

    /*
     * Base64 string.
     */
    if (typeof image === 'string') {

      if (
        image.startsWith(
          'data:image/'
        )
      ) {

        return image;
      }

      /*
       * Product images are stored as byte[]
       * and returned by Jackson as Base64.
       */
      if (
        /^[A-Za-z0-9+/=]+$/.test(image) &&
        image.length > 100
      ) {

        return `data:image/jpeg;base64,${image}`;
      }

      /*
       * Filename compatibility.
       */
      return `${this.baseUrl}/images/${image}`;
    }

    /*
     * Numeric byte array.
     */
    if (Array.isArray(image)) {

      try {

        let binary = '';

        for (
          const value of image
        ) {

          binary +=
            String.fromCharCode(
              Number(value)
            );
        }

        return `data:image/jpeg;base64,${btoa(binary)}`;

      } catch {

        return 'assets/no-image.svg';
      }
    }

    return 'assets/no-image.svg';
  }

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  onImgError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    image.src =
      'assets/no-image.svg';
  }

  // =========================================================
  // ORDER STATUS
  // =========================================================

  isStepDone(
    current: string,
    step: string
  ): boolean {

    if (
      !current ||
      !step
    ) {

      return false;
    }

    const flow = [
      'PENDING',
      'ACCEPTED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];

    const currentIndex =
      flow.indexOf(
        current
          .trim()
          .toUpperCase()
      );

    const stepIndex =
      flow.indexOf(
        step
          .trim()
          .toUpperCase()
      );

    return (
      currentIndex >= 0 &&
      stepIndex >= 0 &&
      currentIndex >= stepIndex
    );
  }
}