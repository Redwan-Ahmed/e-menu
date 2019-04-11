import { CategoryService } from './../../category.service';
import { Category } from './../../models/category';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.css']
})
export class ProductsFilterComponent implements OnInit, OnDestroy {
/** Here all local variables are declared in side this component.ts file */
  cat$: Category[];
  catSubscription : Subscription;
  @Input('category') category;

/** Some code was re-used from my Udemy Course (Section 22, Lecture 323)
    Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7824584?start=0 [Udemy] */
  constructor(private categoryService: CategoryService) { 
/** The catSubscription variable is subscribing to all categories in the categories collection in firebase.
   *  This is done by calling the CategoryService, which then allows me to use the getCategory() function, which I then subscribe to.
   *  the variable cat then stores all the categories in an array, so that it can be called in the component.html file.
*/
    this.catSubscription = this.categoryService.getCategory().subscribe(categories => {
      console.log(categories);
      this.cat$ = categories;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy () {
/** Here I destroy the subscription by unsubscribing from catSubscription.
   * This is done to avoid memory leaks, 
   * and to allow us to detect changes so it can unsubscribe and then subscribe to new changes.
*/
    this.catSubscription.unsubscribe();
  }

}
