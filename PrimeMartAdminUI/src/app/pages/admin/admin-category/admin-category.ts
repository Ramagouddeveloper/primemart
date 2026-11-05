import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { AppConfigService } from '../../../core/config/app-config.service';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.css',
})
export class AdminCategory implements OnInit {

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private config = inject(AppConfigService);
  private cdr = inject(ChangeDetectorRef);

  name: string = '';
  categories: any[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    const adminId = this.auth.getUserId();

    if (!adminId) {
      return;
    }

    const role = this.auth.getRole();

    const url =
      role === 'SUPER_ADMIN'
        ? `${this.config.apiBaseUrl}/admin/categories/all`
        : `${this.config.apiBaseUrl}/admin/categories/admin/${adminId}`;

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
      }
    });
  }

  addCategory(): void {

    if (!this.name || this.name.trim() === '') {

      alert('Enter category name');
      return;
    }

    const adminId = this.auth.getUserId();

    if (!adminId) {

      alert('Admin not logged in');
      return;
    }

    this.http.post(
      `${this.config.apiBaseUrl}/admin/categories?adminId=${adminId}`,
      {
        name: this.name.trim()
      }
    ).subscribe({

      next: (res: any) => {

        alert(res?.message ?? 'Category added successfully');

        // Clear input
        this.name = '';

        // Reload categories
        this.loadCategories();

        // Immediately update UI
        this.cdr.markForCheck();
      },

      error: (err) => {

        console.error('Error adding category', err);

        this.cdr.markForCheck();

        alert('Failed to add category');
      }
    });
  }
}