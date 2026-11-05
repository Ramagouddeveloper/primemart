import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';

export interface PaymentOrderResponse {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly config = inject(AppConfigService);
  constructor(private http: HttpClient) {}

  createOrder(amount: number, receipt: string) {
    return this.http.post<PaymentOrderResponse>(`${this.config.apiBaseUrl}/payments/create-order`, {
      amount,
      currency: 'INR',
      receipt
    });
  }

  verifyPayment(payload: any) {
    return this.http.post<any>(`${this.config.apiBaseUrl}/payments/verify`, payload);
  }
}
