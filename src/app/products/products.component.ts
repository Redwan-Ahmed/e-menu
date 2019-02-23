import { ProductService } from './../product.service';
import { Component, OnDestroy } from '@angular/core';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnDestroy {
  products$: Product[];
  productSubscription : Subscription;

  constructor(productService: ProductService) {
    this.productSubscription = productService.getAll().subscribe(products => {
      console.log(products);
      this.products$ = products;
    });
   }

   ngOnDestroy () {
    this.productSubscription.unsubscribe();
  }

}
