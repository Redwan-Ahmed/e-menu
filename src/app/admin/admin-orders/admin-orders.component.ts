import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {

/** Here all local variables are declared in side this component.ts file */
  orders$: any;
  orderSubscription: Subscription;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
  /** The orderSubscription variable is subscribing to all orders in the orders collection in firebase.
   *  This is done by calling the OrderService, which then allows me to use the getAllOrders() function, which I then subscribe to.
   * the variable orders$ is then set to orders, so that it can be called in the component.html file.
  */
    this.orderSubscription = this.orderService.getAllOrders().subscribe(orders => {
      this.orders$ = orders;
    });
  }

  /** The start() function calls the OrderService: startOrder() function, which takes id as a parameter.
   *  The id is passed thorugh the html file, when the button is clicked (line 36: admin-orders.component.html)
  */
  start(id){
    this.orderService.startOrder(id);
  }

  ngOnDestroy() {
  /** Here I destroy the subscription or unsubscribe
   *  This is done to avoid memory leaks, 
   *  and to allow us to detect changes so it can unsubscribe and then subscribe to new changes.
   */
    this.orderSubscription.unsubscribe();
  }

}
