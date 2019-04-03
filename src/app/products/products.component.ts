import { AngularFirestore } from '@angular/fire/firestore';
import { ShoppingCartService } from './../shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Order } from '../models/order';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
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

    //* to get number of documents in a collection  */
    // this.db.collection('orders').get().toPromise().then(snap => {
    //   this.orderSize = snap.size
    //   console.log('order size', this.orderSize);
    // });
  }

  async ngOnInit() { }

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

    this.model = {
      status: "processing",
      // orderId: localStorage.getItem('orderId'),
      day: n,
      product: this.shoppingCartCollection
    }
    this.cartService.checkoutCart(this.model).then(res => {
      this.router.navigate(['/shopping-cart/' + res]);
    })
    console.log('This Order has been saved!');
  }

  getTotalCartPriceShoppingCartCollection() {
    let sum;
    sum = this.shoppingCartCollection.map(a => a.price * a.quantity)
    console.log('total', sum);

    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }

  ngOnDestroy() { }

}
