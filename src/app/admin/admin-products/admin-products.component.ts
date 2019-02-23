import { Product } from './../../models/product';
import { ProductService } from './../../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products$: Product[];
  filteredProducts: Product[];
  productSubscription: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productSubscription = this.productService.getAll().subscribe(products => {
      this.products$ = products;
      this.filteredProducts = this.products$;
    });
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }

  filter(query: string) {
    //console.log(query);
    this.filteredProducts = (query) ?
      this.products$.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products$;
  }

}
