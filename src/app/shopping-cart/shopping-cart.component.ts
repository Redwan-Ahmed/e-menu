import { Order } from './../models/order';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy{

  order$: any;
  id: string;
  
  constructor(
    private cartService: ShoppingCartService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("this.id", this.id);

    //take operator allows me to take one object and no need to unsubscirbe
    if (this.id) this.cartService.getOrderDoc(this.id).take(1).subscribe(order => { 
      this.order$ = order.order; 
      console.log('1', this.id);
      console.log('2', this.order$);
      });
    
  }

  ngOnInit() { }

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

  payment(){
    this.router.navigate(['/check-out/' + this.id]);
    console.log("The order has been paid!");
  }

  ngOnDestroy() {
  }

}
