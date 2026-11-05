import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../core/services/ProductService';
import { ProductLocationService } from '../../core/services/product-location.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  categories: any[] = [];
  products: any[] = [];

  loadingCategories = true;
  loadingProducts = true;

  constructor(
    private productService: ProductService,
    private productLocationService: ProductLocationService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.loadCategories();

    this.loadHomeProducts();
  }


  // =========================================
  // LOAD CATEGORIES
  // =========================================

  loadCategories(): void {

    this.loadingCategories = true;

    this.cdr.markForCheck();

    this.productService
      .fetchCategories()
      .subscribe({

        next: (response) => {

          this.categories = response ?? [];

          this.loadingCategories = false;

          // Immediately update UI
          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error(
            'Home categories error:',
            error
          );

          this.categories = [];

          this.loadingCategories = false;

          this.cdr.markForCheck();
        }
      });
  }


  // =========================================
  // LOAD HOME PRODUCTS
  // =========================================

  loadHomeProducts(): void {

    this.loadingProducts = true;

    this.cdr.markForCheck();

    // Get saved PRODUCT location
    const savedLocation =
      this.productLocationService
        .getSelectedLocation();


    // =========================================
    // SAVED LOCATION EXISTS
    // =========================================

    if (savedLocation?.id) {

      this.loadProductsForLocation(
        Number(savedLocation.id)
      );

      return;
    }


    // =========================================
    // NO SAVED LOCATION
    // GET AVAILABLE LOCATIONS
    // =========================================

    this.productLocationService
      .getLocations()
      .subscribe({

        next: (locations) => {

          const locationsList =
            locations ?? [];

          const firstLocation =
            locationsList[0];


          // No locations available
          if (!firstLocation?.id) {

            this.products = [];

            this.loadingProducts = false;

            this.cdr.markForCheck();

            return;
          }


          // Save first location
          this.productLocationService
            .saveSelectedLocation(
              firstLocation
            );

          this.cdr.markForCheck();


          // Load products immediately
          this.loadProductsForLocation(
            Number(firstLocation.id)
          );
        },

        error: (error) => {

          console.error(
            'Home locations error:',
            error
          );

          this.products = [];

          this.loadingProducts = false;

          this.cdr.markForCheck();
        }
      });
  }


  // =========================================
  // LOAD PRODUCTS BY LOCATION
  // =========================================

  private loadProductsForLocation(
    locationId: number
  ): void {

    this.loadingProducts = true;

    this.cdr.markForCheck();

    this.productService
      .fetchProducts(locationId)
      .subscribe({

        next: (response) => {

          this.products =
            response ?? [];

          this.loadingProducts = false;

          // Immediately show products
          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error(
            'Home products error:',
            error
          );

          this.products = [];

          this.loadingProducts = false;

          this.cdr.markForCheck();
        }
      });
  }


  // =========================================
  // CATEGORY ICON
  // =========================================

  getCategoryIcon(
    name: string
  ): string {

    const category =
      name?.toLowerCase() || '';


    if (category.includes('grocery')) {
      return '🛒';
    }


    if (category.includes('personal')) {
      return '🧴';
    }


    if (category.includes('home')) {
      return '🏠';
    }


    if (
      category.includes('snack') ||
      category.includes('beverage')
    ) {
      return '🥤';
    }


    if (category.includes('electronic')) {
      return '📱';
    }


    if (category.includes('fashion')) {
      return '👕';
    }


    return '🛍️';
  }


  // =========================================
  // DISCOUNT
  // =========================================

  getDiscount(
    actualPrice: number,
    price: number
  ): number {

    if (
      !actualPrice ||
      !price ||
      actualPrice <= price
    ) {
      return 0;
    }


    return Math.round(
      (
        (actualPrice - price)
        / actualPrice
      ) * 100
    );
  }


  // =========================================
  // PRODUCT IMAGE
  // =========================================

  getImageFromBytes(
    image: unknown
  ): string {

    if (!image) {

      return 'assets/no-image.svg';
    }


    // Base64 string
    if (typeof image === 'string') {

      return image.startsWith('data:image/')
        ? image
        : `data:image/jpeg;base64,${image}`;
    }


    // Byte array
    if (Array.isArray(image)) {

      try {

        let binary = '';

        for (const value of image) {

          binary += String.fromCharCode(
            Number(value)
          );
        }

        return `data:image/jpeg;base64,${btoa(binary)}`;

      } catch (error) {

        console.error(
          'Image conversion error:',
          error
        );

        return 'assets/no-image.svg';
      }
    }


    return 'assets/no-image.svg';
  }


  // =========================================
  // IMAGE ERROR
  // =========================================

  onImageError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    image.src =
      'assets/no-image.svg';

    this.cdr.markForCheck();
  }

}