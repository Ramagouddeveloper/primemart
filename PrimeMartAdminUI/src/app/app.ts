import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbar } from './shared/admin-navbar/admin-navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminNavbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public router: Router) {}
  shouldShowNavbar(): boolean { return this.router.url !== '/login'; }
}
