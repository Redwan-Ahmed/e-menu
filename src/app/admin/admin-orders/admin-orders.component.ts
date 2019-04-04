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
  model: Order;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderSubscription = this.orderService.getAllOrders().subscribe(orders => {
      this.orders$ = orders;
      console.log();
    });
  }

  start(id){
    this.orderService.startOrder(id);
  }

  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
  }

}
