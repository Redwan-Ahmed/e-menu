import { AngularFirestore } from '@angular/fire/firestore';
import { ShoppingCartService } from './../shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Order } from '../models/order';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
/** Here all local variables are declared in side this component.ts file */
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  subscription: Subscription;
  cart: any;
  shoppingCartCollection: any[] = [];
  model: Order;
  modelUpdate: Order;
  order$: Order;
  orderSize: any;

  constructor(
    productService: ProductService,
    private cartService: ShoppingCartService,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
/** Here we get all the products from the products collection, return it as filteredProducts */
    productService.getAll().switchMap(products => {
      this.products = products;
      return route.queryParamMap;
    })
      .subscribe(params => {
        this.category = params.get('category');

        this.filteredProducts = (this.category) ?
          this.products.filter(p => p.category === this.category) :
          this.products;
      });
  }

  async ngOnInit() { }

/** onAddProduct adds a product to the food cart, if the product exists then increase the quantity by 1 */
  onAddProduct(product) {
    // lodash example for searching for a product in an array - not used but an alternative method
    // let existingProduct = _.find(this.shoppingCartCollection, (o) => { return o.id === product.id; });
    // console.log("ProductsComponent.onAddProduct.existingProduct", existingProduct);

    let isProductExist = false;
    for (let index = 0; index < this.shoppingCartCollection.length; index++) {
      const element = this.shoppingCartCollection[index];
      if (element.id === product.id) {
        isProductExist = true;
        element.quantity = element.quantity + 1;
        const tempArray = [...this.shoppingCartCollection];
        this.shoppingCartCollection = [];
        this.shoppingCartCollection = tempArray;
      }
    }

    if (!isProductExist) {
      product["quantity"] = 1;
      this.shoppingCartCollection.push(product);
      const tempArray = [...this.shoppingCartCollection];
      this.shoppingCartCollection = [];
      this.shoppingCartCollection = tempArray;
    }

  }

/** onRemoveProduct removes a product from the food cart, if the product exists then decrease the quantity by 1 */
  onRemoveProduct(product) {
    let isProductExist = false;
    for (let index = 0; index < this.shoppingCartCollection.length; index++) {
      const element = this.shoppingCartCollection[index];
      if (element.id === product.id) {
        isProductExist = true;
        element.quantity = element.quantity - 1;
        const tempArray = [...this.shoppingCartCollection];
        this.shoppingCartCollection = [];
        this.shoppingCartCollection = tempArray;
      } if (product.quantity === 0) {
        if (this.shoppingCartCollection.find(x => x == product)) {
          this.shoppingCartCollection.splice(this.shoppingCartCollection.findIndex(x => x == product), 1);
          const tempArray = [...this.shoppingCartCollection];
          this.shoppingCartCollection = [];
          this.shoppingCartCollection = tempArray;
        }
      }
    }
  }

/** The checkout function passes through the order object and saves it into firebase (cartService.checkoutCart()) */
  checkout(order: Order) {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var n = weekday[d.getDay()];
/** model is just an temporary Order Interface which sets the status, day and product array */
    this.model = {
      status: "processing",
// orderId: localStorage.getItem('orderId'), /** Previously use to store orderId now we pass it through the URL */
      day: n,
      product: this.shoppingCartCollection
    }
/** Here I push the model into the checkoutCart() function which then saves the model as an object in the orders collection */
    this.cartService.checkoutCart(this.model).then(res => {
/** Feed the order ID through the URL */
      this.router.navigate(['/shopping-cart/' + res]);
    })
    console.log('This Order has been saved!');
  }

/** This method gets the total price for the cart, 
  * by a.price * a.quantity each product and then storing the result in an array
  * the numbers in the array are then added together to give the total sum */
  getTotalCartPriceShoppingCartCollection() {
    let sum;
    sum = this.shoppingCartCollection.map(a => a.price * a.quantity)
    console.log('total', sum);

    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }

}
