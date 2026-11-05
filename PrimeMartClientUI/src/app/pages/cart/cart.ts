import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CartService } from '../../core/services/CartService';
import { AuthService } from '../../core/services/auth.service';
import { DeliveryLocationService } from '../../core/services/delivery-location.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  items: any[] = [];

  selectedLocation: any | null = null;

  paymentMethod = 'COD';

  loading = false;

  placingOrder = false;

  paymentError = '';

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private deliveryLocationService: DeliveryLocationService,
    private paymentService: PaymentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.selectedLocation =
      this.deliveryLocationService.getSelectedLocation();

    this.loadCart();

    if (!this.selectedLocation) {
      this.loadDefaultLocation();
    }
  }

  private loadDefaultLocation(): void {

    this.deliveryLocationService.getLocations().subscribe({

      next: locations => {

        if (locations?.[0]) {

          this.selectedLocation = locations[0];

          this.deliveryLocationService
            .saveSelectedLocation(locations[0]);

          // Important for zoneless Angular
          this.cdr.markForCheck();
        }

      },

      error: err => {

        console.error(
          'Cart location error:',
          err
        );

        this.cdr.markForCheck();
      }
    });
  }

  loadCart(): void {

    this.loading = true;

    // Immediately update loading state
    this.cdr.markForCheck();

    this.cartService.getCartItems().subscribe({

      next: response => {

        console.log(
          'Cart response:',
          response
        );

        this.items = response ?? [];

        this.loading = false;

        // Important for zoneless Angular
        this.cdr.markForCheck();
      },

      error: err => {

        console.error(
          'Cart load error:',
          err
        );

        this.items = [];

        this.loading = false;

        // Important for zoneless Angular
        this.cdr.markForCheck();
      }
    });
  }

  increaseQty(item: any): void {

    debugger

    const newQty =
      Number(item.quantity ?? 0) + 1;

      if(newQty > item.product.quantity){
        alert('Maximum stock reached');
        return;
      }

    this.cartService
      .addToCart(
        Number(item.product.id),
        newQty
      )
      .subscribe({

        next: () => {

          item.quantity = newQty;

          this.cartService.loadCartCount();

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Increase quantity error:',
            err
          );

          this.cdr.markForCheck();
        }
      });
  }

  decreaseQty(item: any): void {

    const current =
      Number(item.quantity ?? 0);

    if (current <= 1) {
      return;
    }

    this.cartService
      .addToCart(
        Number(item.product.id),
        current - 1
      )
      .subscribe({

        next: () => {

          item.quantity = current - 1;

          this.cartService.loadCartCount();

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Decrease quantity error:',
            err
          );

          this.cdr.markForCheck();
        }
      });
  }

  removeItem(item: any): void {

    this.cartService
      .addToCart(
        Number(item.product.id),
        0
      )
      .subscribe({

        next: () => {

          this.items =
            this.items.filter(
              current => current !== item
            );

          this.cartService.loadCartCount();

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Remove item error:',
            err
          );

          this.cdr.markForCheck();
        }
      });
  }

  getGrandTotal(): number {

    return this.items.reduce(
      (total, item) =>
        total +
        Number(item?.price ?? 0) *
        Number(item?.quantity ?? 0),
      0
    );
  }

  private buildOrderRequest() {

    if (!this.items.length) {
      throw new Error('Cart is empty');
    }

    const productLocationId =
      Number(
        this.items[0]?.product?.locationId
      );

    const deliveryLocationId =
      Number(
        this.selectedLocation?.id
      );

    if (!productLocationId) {
      throw new Error(
        'Product location is missing'
      );
    }

    if (!deliveryLocationId) {
      throw new Error(
        'Delivery location is missing'
      );
    }

    const invalidProduct =
      this.items.find(
        item =>
          Number(
            item?.product?.locationId
          ) !== productLocationId
      );

    if (invalidProduct) {

      throw new Error(
        'Cart contains products from different product locations'
      );
    }

    return {

      username:
        this.auth.getUsername(),

      productLocationId:
        productLocationId,

      deliveryLocationId:
        deliveryLocationId,

      // Backward compatibility
      locationId:
        deliveryLocationId,

      paymentMethod:
        this.paymentMethod,

      items:
        this.items.map(item => ({

          productId:
            item.product.id,

          quantity:
            item.quantity

        }))
    };
  }

  placeOrder(): void {

    if (
      this.placingOrder ||
      !this.items.length ||
      !this.selectedLocation?.id
    ) {
      return;
    }

    const username =
      this.auth.getUsername();

    if (!username) {

      alert('Please login again');

      this.router.navigate(['/login']);

      return;
    }

    this.paymentError = '';

    if (this.paymentMethod === 'COD') {

      this.placeCodOrder();

    } else {

      this.startOnlinePayment();
    }
  }

  private placeCodOrder(): void {

    this.placingOrder = true;

    this.cdr.markForCheck();

    try {

      this.paymentService
        .verifyPayment({
          mode: 'COD',
          order: this.buildOrderRequest()
        })
        .subscribe({

          next: response => {

            this.finishOrder(
              response?.id
            );
          },

          error: err => {

            this.placingOrder = false;

            alert(
              err?.error?.message ||
              'Unable to place order.'
            );

            this.cdr.markForCheck();
          }
        });

    } catch (error: any) {

      this.placingOrder = false;

      alert(
        error?.message ||
        'Unable to place order.'
      );

      this.cdr.markForCheck();
    }
  }

  private startOnlinePayment(): void {

    this.placingOrder = true;

    this.cdr.markForCheck();

    const amount =
      this.getGrandTotal();

    const receipt =
      `PM-${Date.now()}`;

    this.paymentService
      .createOrder(
        amount,
        receipt
      )
      .subscribe({

        next: paymentOrder => {

          const options: RazorpayOptions = {

            key:
              paymentOrder.keyId,

            amount:
              paymentOrder.amount,

            currency:
              paymentOrder.currency,

            name:
              'PrimeMart',

            description:
              'PrimeMart order payment',

            order_id:
              paymentOrder.razorpayOrderId,

            prefill: {
              name:
                this.auth.getUsername()
            },

            theme: {
              color:
                '#131921'
            },

            handler:
              response =>
                this.verifyOnlinePayment(
                  response
                ),

            modal: {

              ondismiss: () => {

                this.placingOrder = false;

                this.cdr.markForCheck();
              }
            }
          };

          new Razorpay(options).open();

          this.cdr.markForCheck();
        },

        error: err => {

          this.placingOrder = false;

          this.paymentError =
            err?.error?.message ||
            'Unable to start payment.';

          this.cdr.markForCheck();
        }
      });
  }

  private verifyOnlinePayment(
    response: any
  ): void {

    try {

      this.paymentService
        .verifyPayment({

          mode: 'ONLINE',

          razorpayOrderId:
            response.razorpay_order_id,

          razorpayPaymentId:
            response.razorpay_payment_id,

          razorpaySignature:
            response.razorpay_signature,

          order:
            this.buildOrderRequest()
        })
        .subscribe({

          next: result => {

            this.finishOrder(
              result?.id
            );
          },

          error: err => {

            this.placingOrder = false;

            this.paymentError =
              err?.error?.message ||
              'Payment verification failed.';

            this.cdr.markForCheck();
          }
        });

    } catch (error: any) {

      this.placingOrder = false;

      this.paymentError =
        error?.message ||
        'Payment verification failed.';

      this.cdr.markForCheck();
    }
  }

  private finishOrder(
    orderId: number | undefined
  ): void {

    this.cartService
      .clearCart()
      .subscribe({

        next: () => {

          this.cartService.loadCartCount();

          this.items = [];

          this.placingOrder = false;

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Clear cart error:',
            err
          );

          this.items = [];

          this.placingOrder = false;

          this.cdr.markForCheck();
        },

        complete: () => {

          this.items = [];

          this.placingOrder = false;

          this.cdr.markForCheck();

          this.router.navigate(
            ['/order-success'],
            {
              state: {
                orderId
              }
            }
          );
        }
      });
  }
}