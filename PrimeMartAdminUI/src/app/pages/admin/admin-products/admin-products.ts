import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { AppConfigService } from '../../../core/config/app-config.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {

  name: string = '';
  quantity: number | null = null;
  actualPrice: number | null = null;
  price: number | null = null;
  categoryId: number | null = null;

  selectedFile: File | null = null;

  categories: any[] = [];
  products: any[] = [];

  loadingProducts = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private config: AppConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {

    const role = this.auth.getRole();
    const userId = this.auth.getUserId();

    let url = '';

    if (role === 'SUPER_ADMIN') {

      url = `${this.config.apiBaseUrl}/admin/categories/all`;

    } else if (role === 'ADMIN') {

      url = `${this.config.apiBaseUrl}/admin/categories/admin/${userId}`;

    } else {

      alert('Invalid role');
      return;
    }

    this.http.get<any[]>(url).subscribe({

      next: (res) => {

        this.categories = res ?? [];

        // Immediately update UI
        this.cdr.markForCheck();
      },

      error: (err) => {

        console.error('Error loading categories', err);

        this.categories = [];

        this.cdr.markForCheck();

        alert('Failed to load categories');
      }
    });
  }

  loadProducts(): void {

    const adminId = this.auth.getUserId();

    if (!adminId) {
      return;
    }

    this.loadingProducts = true;

    this.cdr.markForCheck();

    this.http
      .get<any[]>(
        `${this.config.apiBaseUrl}/admin/products?adminId=${adminId}`
      )
      .subscribe({

        next: (res) => {

          this.products = res ?? [];
          this.loadingProducts = false;

          // Immediately show products
          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error loading products', err);

          this.products = [];
          this.loadingProducts = false;

          this.cdr.markForCheck();
        }
      });
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedFile = input.files[0];

      // Update file name/UI immediately
      this.cdr.markForCheck();
    }
  }

  addProduct(): void {

    if (
      this.name.trim() === '' ||
      this.quantity === null ||
      this.actualPrice === null ||
      this.price === null ||
      this.categoryId === null ||
      this.selectedFile === null
    ) {

      alert('Please fill all fields');
      return;
    }

    if (this.price > this.actualPrice) {

      alert('Selling price cannot be greater than actual price');
      return;
    }

    const adminId = this.auth.getUserId();

    if (!adminId) {

      alert('Admin not logged in');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.name);
    formData.append('quantity', this.quantity.toString());
    formData.append('actualPrice', this.actualPrice.toString());
    formData.append('price', this.price.toString());
    formData.append('categoryId', this.categoryId.toString());
    formData.append('image', this.selectedFile);

    // Send admin ID
    formData.append('adminId', adminId);

    this.http
      .post(
        `${this.config.apiBaseUrl}/admin/products`,
        formData
      )
      .subscribe({

        next: () => {

          alert('Product Added Successfully');

          this.resetForm();

          // Reload products immediately
          this.loadProducts();

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error('Error adding product', err);

          this.cdr.markForCheck();

          alert('Failed to add product');
        }
      });
  }

  resetForm(): void {

    this.name = '';
    this.quantity = null;
    this.actualPrice = null;
    this.price = null;
    this.categoryId = null;
    this.selectedFile = null;

    this.cdr.markForCheck();
  }
}