import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private get baseUrl() { return `${this.config.apiBaseUrl}/auth`; }

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private config: AppConfigService) {}

  
  private isBrowser(): boolean {

    return isPlatformBrowser(this.platformId);
  }

  
  register(data: any) {

    return this.http.post(
      `${this.baseUrl}/register`,
      data
    );
  }

  
  login(data: any) {

    return this.http.post(
      `${this.baseUrl}/login`,
      data
    );
  }

 
  saveToken(token: string) {

    if (this.isBrowser()) {

      localStorage.setItem("token", token);
    }
  }

  
  saveUser(
    username: string,
    role: string,
    userId: string
  ) {

    if (this.isBrowser()) {

      localStorage.setItem("username", username);

      localStorage.setItem("role", role);

      localStorage.setItem("userId", userId);
    }
  }

  
  getRole(): string {

    if (this.isBrowser()) {

      return localStorage.getItem("role") || '';
    }

    return '';
  }

 
  getUsername(): string {

    if (this.isBrowser()) {

      return localStorage.getItem("username") || '';
    }

    return '';
  }

  getUserId(): string {

    if (this.isBrowser()) {

      return localStorage.getItem("userId") || '';
    }

    return '';
  }


  isLoggedIn(): boolean {

    if (this.isBrowser()) {

      return localStorage.getItem("token") != null;
    }

    return false;
  }

  
  logout() {

    if (this.isBrowser()) {

      localStorage.clear();
    }
  }
}