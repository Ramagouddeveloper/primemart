import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly config = inject(AppConfigService);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private get baseUrl(): string {
    return `${this.config.apiBaseUrl}/auth`;
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  saveUser(username: string, role: string, userId: string | number): void {
    if (this.isBrowser()) {
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', String(userId));
    }
  }

  getRole(): string {
    return this.isBrowser() ? localStorage.getItem('role') || '' : '';
  }

  getUsername(): string {
    return this.isBrowser() ? localStorage.getItem('username') || '' : '';
  }

  getUserId(): string {
    return this.isBrowser() ? localStorage.getItem('userId') || '' : '';
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    }
  }
}
