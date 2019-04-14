import { Order } from './../models/order';
import { Component } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})

export class ShoppingCartComponent {
/** Here all local variables are declared in side this component.ts file */
  order$: any;
  id: string;
  
  constructor(
    private cartService: ShoppingCartService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
/** This gets the id passed through the URL and stores it into the id variable */
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("this.id", this.id);

/** take operator allows me to take one object and no need to unsubscribe */
    if (this.id) this.cartService.getOrderDoc(this.id).take(1).subscribe(order => { 
      this.order$ = order.order; 
      console.log('1', this.id);
      console.log('2', this.order$);
      });
  }
/** This method gets the total quantity in the cart */
  totalQuantity(count: number) {
    count = 0;
    for (let id in this.order$.product)
      count += this.order$.product[id].quantity;
    return count;
  }
/** This method gets the total cart price */
  getTotalCartPrice() {
    let sum;
    sum = this.order$.product.map(a => a.price * a.quantity)
    console.log('total', sum);
    
    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }
/** Since this is not commercially available there is no need for payment processors,
  * Thus I just push the order to the next page, with the order ID.
*/
  payment(){
    this.router.navigate(['/check-out/' + this.id]);
    console.log("The order has been paid!");
  }

}
