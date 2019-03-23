import { Order } from './../models/order';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy{

  subscription: Subscription;
  order$: Order;
  
  constructor(
    private cartService: ShoppingCartService
  ) { }

  ngOnInit() {
    /** This is to get the Cart from Firestore*/
    let orderIdStorage = localStorage.getItem('orderId');
    if (orderIdStorage != null) {
      this.subscription = this.cartService.getSubcollection().subscribe(order => {
        console.log('ShoppingCartComponent. ngOnInit().getSubcollection()', order);

        this.order$ = order[0];
        console.log("ShoppingCartComponent.this.order$.product ", this.order$.product);
      });
    }    
  }

  totalQuantity(count: number) {
    count = 0;
    for (let id in this.order$.product)
      count += this.order$.product[id].quantity;
    return count;
  }

  getTotalCartPrice() {
    let sum;
    sum = this.order$.product.map(a => a.price * a.quantity)
    console.log('total', sum);
    
    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }

  ngOnDestroy() {
    //unsubscribing breaks code
    //this.subscription.unsubscribe();
  }

}
