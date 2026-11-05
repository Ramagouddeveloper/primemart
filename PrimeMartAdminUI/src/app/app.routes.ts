import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminCategory } from './pages/admin/admin-category/admin-category';
import { AdminProducts } from './pages/admin/admin-products/admin-products';
import { AdminLocation } from './pages/admin-location/admin-location';
import { AdminOrders } from './pages/admin-orders/admin-orders';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'admin/products', component: AdminProducts },
  { path: 'admin/categories', component: AdminCategory },
  { path: 'admin/locations', component: AdminLocation },
  { path: 'admin/orders', component: AdminOrders },
  { path: '**', redirectTo: 'admin/products' }
];
