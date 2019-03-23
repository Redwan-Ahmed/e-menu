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
  cat$: Category[];
  catSubscription : Subscription;
  @Input('category') category;

  constructor(private categoryService: CategoryService) { 
    this.catSubscription = this.categoryService.getCategory().subscribe(categories => {
      console.log(categories);
      this.cat$ = categories;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy () {
    this.catSubscription.unsubscribe();
  }

}
