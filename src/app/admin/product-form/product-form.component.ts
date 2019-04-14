import { ActivatedRoute } from '@angular/router';
import { Category } from './../../models/category';
import { Subscription } from 'rxjs';
import { CategoryService } from './../../category.service';
import { Component, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Product } from './../../models/product';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnDestroy {

/** Here product is just a copy of the Product interface located in the models/product folder
  *  This is needed in the .html component, when we connect the input fields with the Product interface, via NgModel.
 */
  product: Product = {
    title: '',
    price: null,
    category: '',
    imageUrl: '',
    prepTime: null
  }
/** Here all local variables are declared in side this component.ts file */
  cat: Category[];
  catSubscription : Subscription;
  id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService, 
    private productService: ProductService) {
/** this.id is equal to the product id which is passed through the url, this is done by taking a snapshot of the naviagtion route */ 
      this.id = this.route.snapshot.paramMap.get('id');
      console.log('id url is:', this.id);
/** Line 46: checks if id is not null, then get the product via ProductService (function called is getProduct(id)),
  * If id is null, then the user is adding a new product.
  * The take operator allows me to take one object thus there is no need to unsubscribe.
*/
      if (this.id) this.productService.getProduct(this.id).take(1).subscribe(product => { 
        this.product = product; 
        console.log('1', this.id);
        console.log('2', this.product);
        });
    }

  ngOnInit () {
/** The catSubscription variable is subscribing to all categories in the categories collection in firebase.
   *  This is done by calling the CategoryService, which then allows me to use the getCategory() function, which I then subscribe to.
   *  the variable cat then stores all the categories in an array, so that it can be called in the component.html file.
*/
    this.catSubscription = this.categoryService.getCategory().subscribe(categories => {
      console.log(categories);
      this.cat = categories;
    });
  }

  save (){
/** This save method allows us to do both add a new product or update an existing product.
  * This is done by using a nested if statement, we first check if the input fields are NOT blank (validation is provided),
  * Then we have a nested If statements, it checks if there is an id, if id exists then we call the updateProduct() function.
  * Else we create() a new product.
  * Code has been inspired from my Udemy course, Section 21, Lecture 308.
  * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7807732?start=213 [Udemy]
 */
    if(this.product.title != '' && this.product.price != null && this.product.category != '' && this.product.imageUrl != '' && this.product.prepTime != null){
      //if there is an id call the updateProduct() method in the ProductService
      if(this.id) this.productService.updateProduct(this.id, this.product);
      //else create a new product by calling the create() method in the ProductService
      else this.productService.create(this.product);
      //console log the added product
      console.log('Product has been Added!', this.product);
      //empty the input fields after saving
      this.product.title = '';
      this.product.price = null;
      this.product.category = '';
      this.product.imageUrl = '';
      this.product.prepTime = null;

      this.router.navigate(['/admin/products']);
    }
  }

  delete(){
/** This delete method allows the user to delete a product.
  * This is done by displaying a warning notification, which the user has to confirm the deletion of a product.
  * If the user does not confirm the warning (!confirm), they are returned back to the page. (line 99)
  * If the user confirms the warning the deletedProduct(id) method is called from the productService; (line 101)
  * The product is then deleted and returns the user back to the products page. (line 102-103) 
  * Code has been inspired from my Udemy course, Section 21, Lecture 309.
  * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7807734?start=65 [Udemy]
 */
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(this.id);
    console.log('Product has been deleted!', this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnDestroy(){
/** Here I destroy the subscription by unsubscribing from catSubscription.
   * This is done to avoid memory leaks, 
   * and to allow us to detect changes so it can unsubscribe and then subscribe to new changes.
*/
    this.catSubscription.unsubscribe();
  }

}
