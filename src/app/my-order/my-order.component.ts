import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit, OnDestroy {
  orders$: any;
  orderSubscription: Subscription;
  monday: any[] = [];
  tuesday: any[] = [];
  wednesday: any[] = [];
  thursday: any[] = [];
  friday: any[] = [];
  saturday: any[] = [];
  sunday: any[] = [];

  selectedDay;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getAllOrders();
    this.filterDay();
  }

  getAllOrders() {
    this.orderSubscription = this.orderService.getAllOrders().subscribe(orders => {
      this.orders$ = orders;
      console.log(this.orders$);
      this.orders$.forEach(order => {
        let products = [];
        order.order.product.forEach(product => {
          let productObj = { name: product.title,  qty: product.quantity, img: product.imageUrl  }
          products.push(productObj);
        });

        if (order.order.day === "Monday") {
          this.monday = this.monday.concat(products);
          this.monday =  this.mergeSameValueArrays(this.monday);
          console.log("monday", this.monday);
          
        }

        if (order.order.day === "Tuesday") {
          this.tuesday = this.tuesday.concat(products);
          this.tuesday =  this.mergeSameValueArrays(this.tuesday);
        }

        if (order.order.day === "Wednesday") {
          this.wednesday = this.wednesday.concat(products);
          this.wednesday =  this.mergeSameValueArrays(this.wednesday);
        }

        if (order.order.day === "Thursday") {
          this.thursday = this.thursday.concat(products);
          this.thursday =  this.mergeSameValueArrays(this.thursday);
        }

        if (order.order.day === "Friday") {
          this.friday = this.friday.concat(products);
          this.friday =  this.mergeSameValueArrays(this.friday);
        }

        if (order.order.day === "Saturday") {
          this.saturday = this.saturday.concat(products);
          this.saturday =  this.mergeSameValueArrays(this.saturday);
        }

        if (order.order.day === "Sunday") {
          this.sunday = this.sunday.concat(products);
          this.sunday =  this.mergeSameValueArrays(this.sunday);
        }
      });
    });
  }

  mergeSameValueArrays(array) {
    // _.map(_.groupBy(array, "name"), (vals, name) => {
    //   return _.reduce(vals, (m, o) => {
    //     for (var p in o)
    //       if (p != "name")
    //         m[p] = (m[p] || 0) + o[p];
    //     return m;
    //   }, { name: name });
    // });
    let tempArray = [];
    let groupedProducts = _.groupBy(array, "name");
    Object.keys(groupedProducts).forEach((key) => {
      let product = { name: key, qty: 0 };
      let qty = 0;
      groupedProducts[key].forEach(element => {
        qty = qty + element.qty;
      });
      tempArray.push({ name: key, qty: qty, img: groupedProducts[key][0].img})
    });
    return tempArray;

  }

  filterDay() {
    /**
     * Was able to get the value of the selecter by looking into HTMLInputElement
     * Source: https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
     */
    const inputElement: HTMLInputElement = document.getElementById("inputGroupSelect01") as HTMLInputElement;
    const inputValue: string = inputElement.value;
    console.log(inputValue);
    this.selectedDay = inputValue;
    // console.log(this.orders$);
    // let filter = this.orderService.filterByDay();
    // console.log(filter);

  }

  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
  }

}
