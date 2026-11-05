import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/ProductService';
import { CartService } from '../../core/services/CartService';
import { ProductLocationService } from '../../core/services/product-location.service';

import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnDestroy {

  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  locations: any[] = [];

  selectedLocationId: number | null = null;
  selectedCategoryId: number | null = null;

  searchText = '';
  sortBy = 'latest';

  cartQuantities: Record<number, number> = {};

  loadingCategories = true;
  loadingLocations = true;
  loadingProducts = true;

  noLocationSelected = false;
  errorMessage = '';

  private refreshSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private productLocationService: ProductLocationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    /*
     * Load everything required by the page.
     *
     * Products page does NOT depend on Navbar.
     */
    this.loadCategories();
    this.loadLocationsAndProducts();

    /*
     * Automatically check for newly added products.
     *
     * Admin can add a product from another application.
     * This page will automatically reload the selected
     * product location every 5 seconds.
     */
    this.startProductAutoRefresh();
  }

  ngOnDestroy(): void {

    this.refreshSubscription?.unsubscribe();
  }

  // =========================================================
  // LOCATIONS
  // =========================================================

  loadLocationsAndProducts(): void {

    this.loadingLocations = true;
    this.loadingProducts = true;
    this.noLocationSelected = false;
    this.errorMessage = '';

    this.cdr.markForCheck();

    this.productLocationService
      .getLocations()
      .subscribe({

        next: locations => {

          this.locations = locations ?? [];

          this.loadingLocations = false;

          let selected =
            this.productLocationService
              .getSelectedLocation();

          /*
           * Make sure the saved location still exists.
           */
          if (selected) {

            selected =
              this.locations.find(
                loc =>
                  Number(loc.id) ===
                  Number(selected.id)
              ) ?? null;
          }

          /*
           * First visit:
           * automatically select first active location.
           */
          if (
            !selected &&
            this.locations.length > 0
          ) {

            selected = this.locations[0];
          }

          /*
           * No locations available.
           */
          if (!selected) {

            this.selectedLocationId = null;

            this.noLocationSelected = true;

            this.loadingProducts = false;

            this.cdr.markForCheck();

            return;
          }

          /*
           * Save selected product location.
           */
          this.selectedLocationId =
            Number(selected.id);

          this.productLocationService
            .saveSelectedLocation(selected);

          this.cdr.markForCheck();

          /*
           * Load products immediately.
           */
          this.loadProducts(
            Number(selected.id)
          );
        },

        error: err => {

          console.error(
            'Product location loading error:',
            err
          );

          this.locations = [];

          this.loadingLocations = false;

          this.loadingProducts = false;

          this.noLocationSelected = true;

          this.errorMessage =
            'Unable to load product locations.';

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // CATEGORIES
  // =========================================================

  loadCategories(): void {

    this.loadingCategories = true;

    this.cdr.markForCheck();

    this.productService
      .fetchCategories()
      .subscribe({

        next: categories => {

          this.categories =
            categories ?? [];

          this.loadingCategories = false;

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Category loading error:',
            err
          );

          this.categories = [];

          this.loadingCategories = false;

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // PRODUCTS
  // =========================================================

  loadProducts(locationId: number): void {

    if (!locationId) {
      return;
    }

    this.loadingProducts = true;
    this.errorMessage = '';

    this.cdr.markForCheck();

    this.productService
      .fetchProducts(locationId)
      .subscribe({

        next: products => {

          console.log(
            'Products loaded for location:',
            locationId,
            products
          );

          this.products =
            products ?? [];

          this.loadingProducts = false;

          this.applyFilters();

          this.loadExistingCartQuantities();

          /*
           * Important for zoneless Angular.
           */
          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Product loading error:',
            err
          );

          this.products = [];

          this.filteredProducts = [];

          this.loadingProducts = false;

          this.errorMessage =
            'Unable to load products.';

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // LOCATION CHANGE
  // =========================================================

  onLocationChange(): void {

    if (this.selectedLocationId === null) {
      return;
    }

    const selected =
      this.locations.find(
        location =>
          Number(location.id) ===
          Number(this.selectedLocationId)
      );

    if (!selected) {
      return;
    }

    /*
     * Save PRODUCT location only.
     *
     * This does not change delivery location.
     */
    this.productLocationService
      .saveSelectedLocation(selected);

    /*
     * Immediately load products for
     * the newly selected location.
     */
    this.loadProducts(
      Number(selected.id)
    );
  }

  // =========================================================
  // AUTO REFRESH
  // =========================================================

  private startProductAutoRefresh(): void {

    /*
     * Check every 5 seconds.
     *
     * This allows a newly added product from Admin UI
     * to appear automatically without clicking anything.
     */
    this.refreshSubscription =
      interval(5000).subscribe(() => {

        const locationId =
          this.selectedLocationId;

        if (!locationId) {
          return;
        }

        this.refreshProductsSilently(
          locationId
        );
      });
  }

  private refreshProductsSilently(
    locationId: number
  ): void {

    /*
     * Don't show the loading spinner during
     * automatic refresh.
     */
    this.productService
      .fetchProducts(locationId)
      .subscribe({

        next: products => {

          this.products =
            products ?? [];

          this.applyFilters();

          this.cdr.markForCheck();
        },

        error: err => {

          /*
           * Don't disturb the existing products
           * if background refresh fails.
           */
          console.error(
            'Automatic product refresh error:',
            err
          );
        }
      });
  }

  // =========================================================
  // SEARCH
  // =========================================================

  onSearchChange(): void {

    this.applyFilters();
  }

  // =========================================================
  // SORT
  // =========================================================

  onSortChange(): void {

    this.applyFilters();
  }

  // =========================================================
  // CATEGORY
  // =========================================================

  selectCategory(
    id: number | null
  ): void {

    this.selectedCategoryId = id;

    this.applyFilters();
  }

  // =========================================================
  // FILTER
  // =========================================================

  applyFilters(): void {

    let list = [
      ...this.products
    ];

    /*
     * Category filter.
     */
    if (
      this.selectedCategoryId !== null
    ) {

      list =
        list.filter(product => {

          const categoryId =
            product?.category?.id ??
            product?.categoryId;

          return (
            Number(categoryId) ===
            Number(this.selectedCategoryId)
          );
        });
    }

    /*
     * Search filter.
     */
    const search =
      this.searchText
        .trim()
        .toLowerCase();

    if (search) {

      list =
        list.filter(product =>
          String(
            product?.name ?? ''
          )
            .toLowerCase()
            .includes(search)
        );
    }

    /*
     * Sorting.
     */
    switch (this.sortBy) {

      case 'priceLow':

        list.sort(
          (a, b) =>
            Number(a?.price ?? 0) -
            Number(b?.price ?? 0)
        );

        break;

      case 'priceHigh':

        list.sort(
          (a, b) =>
            Number(b?.price ?? 0) -
            Number(a?.price ?? 0)
        );

        break;

      default:

        list.sort(
          (a, b) =>
            Number(b?.id ?? 0) -
            Number(a?.id ?? 0)
        );

        break;
    }

    this.filteredProducts = list;

    this.cdr.markForCheck();
  }

  // =========================================================
  // CART QUANTITIES
  // =========================================================

  loadExistingCartQuantities(): void {

    this.cartService
      .getCartItems()
      .subscribe({

        next: (items: any[]) => {

          this.cartQuantities = {};

          for (
            const item of items ?? []
          ) {

            const productId =
              Number(
                item?.product?.id ??
                item?.productId
              );

            if (productId) {

              this.cartQuantities[
                productId
              ] =
                Number(
                  item?.quantity ?? 0
                );
            }
          }

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Cart quantity loading error:',
            err
          );

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  increaseQty(product: any): void {

    if (
      !product?.id ||
      Number(product.quantity ?? 0) <= 0
    ) {
      return;
    }
    const productId =
      Number(product.id);

    const currentQty =
      this.getQuantity(product);

    const stock =
      Number(product.quantity ?? 0);

    if (currentQty >= stock) {

      alert(
        'Maximum stock reached'
      );

      return;
    }

    this.updateCartQuantity(
      product,
      currentQty + 1
    );
  }

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  decreaseQty(product: any): void {

    if (!product?.id) {
      return;
    }

    const currentQty =
      this.getQuantity(product);

    if (currentQty <= 0) {
      return;
    }

    this.updateCartQuantity(
      product,
      currentQty - 1
    );
  }

  // =========================================================
  // UPDATE CART
  // =========================================================

  private updateCartQuantity(
    product: any,
    quantity: number
  ): void {

    const productId =
      Number(product.id);

    this.cartService
      .addToCart(
        productId,
        quantity
      )
      .subscribe({

        next: () => {

          if (quantity <= 0) {

            delete this.cartQuantities[
              productId
            ];

          } else {

            this.cartQuantities[
              productId
            ] = quantity;
          }

          this.cartService
            .loadCartCount();

          this.cdr.markForCheck();
        },

        error: err => {

          console.error(
            'Cart update error:',
            err
          );

          alert(
            'Unable to update cart. Please try again.'
          );

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================================
  // GET QUANTITY
  // =========================================================

  getQuantity(
    product: any
  ): number {

    return Number(
      this.cartQuantities[
      Number(product?.id)
      ] ?? 0
    );
  }

  // =========================================================
  // IMAGE
  // =========================================================

  getImageFromBytes(
    image: unknown
  ): string {

    if (!image) {

      return 'assets/no-image.svg';
    }

    /*
     * Jackson byte[] -> Base64 string.
     */
    if (typeof image === 'string') {

      return image.startsWith(
        'data:image/'
      )
        ? image
        : `data:image/jpeg;base64,${image}`;
    }

    /*
     * Support numeric byte array.
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

  onImageError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    image.src =
      'assets/no-image.svg';
  }
}