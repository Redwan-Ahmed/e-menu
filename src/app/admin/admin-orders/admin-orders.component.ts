import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/app/models/order';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {

  orders$: any;
  orderSubscription: Subscription;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderSubscription = this.orderService.getAllOrders().subscribe(orders => {
      this.orders$ = orders;
      console.log(orders);
    });
  }

  getTotalCartPrice() {
    // let sum;
    // sum = this.orders$.product.map(a => a.price * a.quantity)
    // console.log('total', this.orders$);
    
    // const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    // console.log('totalCartPrice', totalCartPrice);
    // return totalCartPrice;
  }

  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
  }

}
