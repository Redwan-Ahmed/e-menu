import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit, OnChanges {

  @Input('product') product: Product;
  @Input('shoppingCart') shoppingCart;
  @Output() onAddProduct = new EventEmitter();
  @Output() onRemoveProduct = new EventEmitter();
  quantity: number = 0;
  constructor(private cartService: ShoppingCartService) { }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
/** I used Loadash (Library) which has a function called .find; which returns the matched element
    * Source: https://lodash.com/docs/4.17.11#find [Loadash]
*/
    if (changes.shoppingCart) {
      let currentProduct = _.find(this.shoppingCart, (o) => { return o.id === this.product.id; });
      console.log("currentProduct", currentProduct);
      if (currentProduct) {
        this.quantity = currentProduct.quantity;
      } else {
        this.quantity = 0;
      }
    }

  }

/** This method adds a product to the cart, the emit function allows other files to use it as an event */
  addToCart(product: Product) {
    this.onAddProduct.emit(product);
  }
/** This method removes a product from the cart, the emit function allows other files to use it as an event */
  removeFromCart(product: Product) {
    this.onRemoveProduct.emit(product);
  }

}
