import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
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
    if (changes.shoppingCart) {
      let currentProduct = _.find(this.shoppingCart, (o) => { return o.id === this.product.id; });      
      if (currentProduct) {
        this.quantity = currentProduct.quantity;
      } else {
        this.quantity = 0;
      }
    }

  }

  addToCart(product: Product) {
    this.onAddProduct.emit(product);
  }

  removeFromCart(product: Product) {
    this.onRemoveProduct.emit(product);
  }

  // getQuantity() {
  //   if (!this.shoppingCart) return 0;

  //   let item = this.shoppingCart.items[this.product.key];
  //   return item ? item.quantity : 0;
  // }


}
