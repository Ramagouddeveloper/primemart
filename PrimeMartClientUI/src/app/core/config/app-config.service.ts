import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiBaseUrl: string;
  razorpayKeyId: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    const config = await firstValueFrom(
      this.http.get<AppConfig>('/assets/config.json')
    );

    if (!config?.apiBaseUrl?.trim()) {
      throw new Error('apiBaseUrl is missing in assets/config.json');
    }

    if (!config?.razorpayKeyId?.trim()) {
      throw new Error('razorpayKeyId is missing in assets/config.json');
    }

    this.config = {
      apiBaseUrl: config.apiBaseUrl.replace(/\/$/, ''),
      razorpayKeyId: config.razorpayKeyId.trim()
    };
  }

  get razorpayKeyId(): string {
    if (!this.config) {
      throw new Error('Application config has not been loaded yet.');
    }
    return this.config.razorpayKeyId;
  }

  get apiBaseUrl(): string {
    if (!this.config) {
      throw new Error('Application config has not been loaded yet.');
    }

    return this.config.apiBaseUrl;
  }
}
