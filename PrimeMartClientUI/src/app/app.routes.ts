import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Products } from './pages/products/products';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { OrderSuccess } from './pages/order-success/order-success';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'products', component: Products },
  { path: 'cart', component: Cart },
  { path: 'orders', component: Orders },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'order-success', component: OrderSuccess },
  { path: '**', redirectTo: 'home' }
];
