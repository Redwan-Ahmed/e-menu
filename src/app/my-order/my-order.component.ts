import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit, OnDestroy {
  orders$: any;
  orderSubscription: Subscription;

  selectedDay;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getAllOrders();
    this.filterDay();
  }

  getAllOrders() {
    this.orderSubscription = this.orderService.getAllOrders().subscribe(orders => {
      this.orders$ = orders;
    });
  }

  filterDay(){
/**
 * Was able to get the value of the selecter by looking into HTMLInputElement
 * Source: https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
 */
    const inputElement: HTMLInputElement = document.getElementById("inputGroupSelect01") as HTMLInputElement;
    const inputValue: string = inputElement.value;
    console.log(inputValue);
    this.selectedDay = inputValue;
    //console.log(this.orders$);
    // let filter = this.orderService.filterByDay();
    // console.log(filter);

  }

  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
  }

}
