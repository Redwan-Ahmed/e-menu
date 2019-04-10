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

/** Here all local variables are declared in side this component.ts file */
  products$: Product[];
  filteredProducts: Product[];
  productSubscription: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit() {
/** Here the getAlLProducts() function is triggered, once the user is on this page (hence why it is in the ngOnInit method) */
    this.getAllProducts();
  }

  getAllProducts() {
/** The productSubscription variable is subscribing to all products in the products collection in firebase.
   *  This is done by calling the ProductService, which then allows me to use the getAll() function, which I then subscribe to.
   *  the variable products$ is then set to products. 
   *  Then I set filteredProducts to be equal to products$, so that it can be called in the component.html file.
*/
    this.productSubscription = this.productService.getAll().subscribe(products => {
      this.products$ = products;
      this.filteredProducts = this.products$;
    });
  }

  ngOnDestroy() {
/** Here I destroy the subscription or unsubscribe
   *  This is done to avoid memory leaks, 
   *  and to allow us to detect changes so it can unsubscribe and then subscribe to new changes.
*/
    this.productSubscription.unsubscribe();
  }

  filter(query: string) {
/** As mentioned above, the filteredProducts = products$, which then allows us to store all the products in filteredProducts.
   *  This then allows me to query filteredProducts array which then can be used in the .html component. 
   *  Line 55; I make filteredProducts equal to query (the paramter passed in through the html component). 
   *           Note: the '?' is used to avoid nullExeception errors whilst typing in the search bar.
   *  Line 56; The filter function is used on the products$ array.
   *           Note: filter function returns the elements of an array that meet the condition specified in a callback function.
   *           I then match the product title (p.title) with the query (toLowerCase is so the search isn't case sensitive).
   *  Line 57; This line just returns the filtered product to product array.
*/
/** Code has been inspired from my Udemy course, Section 21, Lecture 310.
 *  Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7807736?start=0 [Udemy] */
    this.filteredProducts = (query) ?
      this.products$.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products$;
  }

}
