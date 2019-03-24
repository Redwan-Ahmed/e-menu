import { AngularFirestore } from '@angular/fire/firestore';
import { ShoppingCartService } from './../shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
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
//
  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private cartService: ShoppingCartService,
    //private db: AngularFirestore
  ) {
    productService.getAll().switchMap(products => {
      this.products = products;
      return route.queryParamMap;
    })
    // fkljvlfgvfgjdfjv
      .subscribe(params => {
        this.category = params.get('category');

        this.filteredProducts = (this.category) ?
          this.products.filter(p => p.category === this.category) :
          this.products;
      });

      let orderIdStorage = localStorage.getItem('orderId');
      if (orderIdStorage != null) {
        this.subscription = this.cartService.getSubcollection().subscribe(order => {
          console.log('ProductsComponent.constructor.getSubcollection()', order);
  
          this.order$ = order[0];
          console.log("this.order$.product ", this.order$.product);
        });
      }

      //* to get number of documents in a collection  */
      // this.db.collection('orders').get().toPromise().then(snap => {
      //   this.orderSize = snap.size
      //   console.log('order size', this.orderSize);
      // });
      
      //previous subcollection query for order
      // this.subscription = this.cartService.getSubcollection().subscribe(order => {
      //   console.log('ProductsComponent.constructor.getSubcollection()', order);

      //   this.order$ = order[0].order;
      //   console.log("this.order$.product ", this.order$.product);
      // });
  
  }

  async ngOnInit() {
    //this.subscription = (await this.cartService.getCart()).subscribe(cart => this.cart = cart);
  }

  onAddProduct(product) {
    // console.log("ProductsComponent.onAddProduct.product", product);
    // lodash example 
    // let existingProduct = _.find(this.shoppingCartCollection, (o) => { return o.id === product.id; });
    // console.log("ProductsComponent.onAddProduct.existingProduct", existingProduct);
    let isProductExist = false;
    
    let orderIdStorage = localStorage.getItem('orderId');
    if (orderIdStorage != null) {
    if(this.order$.product != null && this.order$.product.length > 0) {
      for (let index = 0; index < this.order$.product.length; index++) {
        const element = this.order$.product[index];
        if (element.id === product.id) {
          isProductExist = true;
          element.quantity = element.quantity + 1;
          const tempArray = [...this.order$.product];
          this.order$.product = [];
          this.order$.product = tempArray;
        }
      }
  
      if (!isProductExist) {
        product["quantity"] = 1;
        this.order$.product.push(product);
        const tempArray = [...this.order$.product];
        this.order$.product = [];
        this.order$.product = tempArray;
      }
    }
    } else {
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

  }

  onRemoveProduct(product) {
    // console.log("ProductsComponent.onAddProduct.product", product);
    // lodash example 
    // let existingProduct = _.find(this.shoppingCartCollection, (o) => { return o.id === product.id; });
    // console.log("ProductsComponent.onAddProduct.existingProduct", existingProduct);
    let isProductExist = false;

    let orderIdStorage = localStorage.getItem('orderId');
    console.log('onRemoveProduct.this.order$.product', this.order$.product);
    
    if (orderIdStorage != null) {
      if(this.order$.product != null && this.order$.product.length > 0) {
        for (let index = 0; index < this.order$.product.length; index++) {
          const element = this.order$.product[index];
          if (element.id === product.id) {
            isProductExist = true;
            element.quantity = element.quantity - 1;
            if (element.quantity === 0) {
              this.order$.product.splice(index, 1);
            }
            const tempArray = [...this.order$.product];
            this.order$.product = [];
            this.order$.product = tempArray;
          } 
        }
      }
    } else {
      for (let index = 0; index < this.shoppingCartCollection.length; index++) {
        const element = this.shoppingCartCollection[index];
        if (element.id === product.id) {
          isProductExist = true;
          element.quantity = element.quantity - 1;
          const tempArray = [...this.shoppingCartCollection];
          this.shoppingCartCollection = [];
          this.shoppingCartCollection = tempArray;
        } if (product.quantity === 0) {
          // product["quantity"] = 0;
          // this.shoppingCartCollection.push(product);
          if (this.shoppingCartCollection.find(x => x == product)) {
            this.shoppingCartCollection.splice(this.shoppingCartCollection.findIndex(x => x == product), 1);
            const tempArray = [...this.shoppingCartCollection];
            this.shoppingCartCollection = [];
            this.shoppingCartCollection = tempArray;
          }
        }
      }

    }

    // for (let index = 0; index < this.shoppingCartCollection.length; index++) {
    //   const element = this.shoppingCartCollection[index];
    //   if (element.id === product.id) {
    //     isProductExist = true;
    //     element.quantity = element.quantity - 1;
    //     const tempArray = [...this.shoppingCartCollection];
    //     this.shoppingCartCollection = [];
    //     this.shoppingCartCollection = tempArray;
    //   } if (product.quantity === 0) {
    //     // product["quantity"] = 0;
    //     // this.shoppingCartCollection.push(product);
    //     if (this.shoppingCartCollection.find(x => x == product)) {
    //       this.shoppingCartCollection.splice(this.shoppingCartCollection.findIndex(x => x == product), 1);
    //       const tempArray = [...this.shoppingCartCollection];
    //       this.shoppingCartCollection = [];
    //       this.shoppingCartCollection = tempArray;
    //     }
    //   }
    // }

    //not working atm
    // if (!isProductExist) {
    //   if (this.shoppingCartCollection.find(x => x == product)) {
    //     this.shoppingCartCollection.splice(this.shoppingCartCollection.findIndex(x => x == product), 1);
    //     const tempArray = [...this.shoppingCartCollection];
    //     this.shoppingCartCollection = [];
    //     this.shoppingCartCollection = tempArray;
    //  }
    // }

  }

  checkout(order: Order, orderUpdate: Order){
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var n = weekday[d.getDay()];
    
    this.model = {
      status:"processing",
      orderId: localStorage.getItem('orderId'),
      day: n,
      product: this.order$.product //this.shoppingCartCollection
    }

    this.modelUpdate = {
      status:"processing",
      orderId: localStorage.getItem('orderId'),
      day: n,
      product: this.order$.product
    }
    order = this.model;
    orderUpdate = this.modelUpdate;
    console.log(order);
    
    let orderIdStorage = localStorage.getItem('orderId');
    if (orderIdStorage != null) {
      this.cartService.updateCart(orderUpdate);
      console.log('This order has been updated!');
    } else {
      this.cartService.checkoutCart(order);
      console.log('This Order has been saved!');
   }
    // this.cartService.checkoutCart(order);
    // console.log('This Order has been saved!');
  }

  getTotalCartPrice() {
    let sum;
    sum = this.order$.product.map(a => a.price * a.quantity)
    console.log('total', sum);
    
    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }

  getTotalCartPriceShoppingCartCollection() {
    let sum;
    sum = this.shoppingCartCollection.map(a => a.price * a.quantity)
    console.log('total', sum);
    
    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
