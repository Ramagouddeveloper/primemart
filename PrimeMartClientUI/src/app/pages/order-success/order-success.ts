import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',

})
export class OrderSuccess {
   orderId: any;

  constructor() {
    this.orderId = history.state?.orderId;
  }

}
