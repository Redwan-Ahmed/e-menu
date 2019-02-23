import { ActivatedRoute } from '@angular/router';
import { Category } from './../../models/category';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from './../../category.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Product } from './../../models/product';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnDestroy{

  product: Product = {
    title: '',
    price: null,
    category: '',
    imageUrl: ''
  }

  cat: Category[];
  catSubscription : Subscription;
  id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService, 
    private productService: ProductService) { 
      this.id = this.route.snapshot.paramMap.get('id');
      console.log('id url is:', this.id);
      //take operator allows me to take one object and no need to unsubscirbe
      if (this.id) this.productService.getProduct(this.id).take(1).subscribe(product => { 
        this.product = product; 
        console.log('1', this.id);
        console.log('2', this.product);
        });
    }

  ngOnInit () {
    this.catSubscription = this.categoryService.getCategory().subscribe(categories => {
      console.log(categories);
      this.cat = categories;
    });
  }

  save (){
    if(this.product.title != '' && this.product.price != null && this.product.category != '' && this.product.imageUrl != ''){
      //edit or update function in the service
      if(this.id) this.productService.updateProduct(this.id, this.product);
      //create function in the service
      else this.productService.create(this.product);
      //console log
      console.log('Product has been Added!', this.product);
      //empty the input fields
      this.product.title = '';
      this.product.price = null;
      this.product.category = '';
      this.product.imageUrl = '';

      this.router.navigate(['/admin/products']);
    }
  }

  delete(){
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(this.id);
    console.log('Product has been deleted!', this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnDestroy(){
    this.catSubscription.unsubscribe();
  }

}
