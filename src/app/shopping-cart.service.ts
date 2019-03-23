import { Product } from './models/product';
import { ShoppingCart } from './models/shopping-cart';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable, OnDestroy } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { Order } from './models/order';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService implements OnDestroy{
  subscription: Subscription;

  orderDoc: AngularFirestoreDocument<Order>;
  ordDoc: Observable<Order[]>;

  orderCol: AngularFirestoreCollection<Order>;

  order$: Order;


  constructor(private db: AngularFirestore) { }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  async clearCart() {
    console.log('cleared cart');
    const cartId = await this.getOrCreateCartId();
    this.db.collection('shopping-carts').doc(cartId).collection('items').snapshotChanges().pipe(take(1))
    .subscribe(products => {  products.map(productItem =>
      this.db.collection('shopping-carts').doc(cartId).collection('items').doc(productItem.payload.doc.id).delete()
      );
    });
  }

  private create() {
    return this.db.collection('shopping-carts').add({
      dateCreated: new Date().getTime()
    });
  }

  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    const Cart = this.db.collection('shopping-carts').doc(cartId).collection('items').snapshotChanges()
      .pipe(map(x => new ShoppingCart(x as any)
      ));
    return Cart;
  }

    private getItem(cartId: string, productId: string): Observable<any> {
    //return this.db.doc(`/shopping-carts/${cartId}`);

    return this.db.collection('shopping-carts').doc(cartId).collection('items').doc('added_products' + productId).valueChanges();

    //return this.db.doc(`/shopping-carts/${cartId}/items/${productId}`);

 }

  // private async getOrCreateCartId() {
  //   let cartId = localStorage.getItem('cartId');
  //   if (cartId) return cartId;
    
  //   let result = await this.create();
  //   localStorage.setItem('cartId', result.id);
  //   return result.id;
  // }

  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
      const result = await this.create();
      localStorage.setItem('cartId', result.id);
      return result.id;

    } return cartId;
  }
  
  async addToCart (product: Product) {
    this.updateItemQuantity(product, 1);

    // const cartId = await this.getOrCreateCartId();
    // const items = this.getItem(cartId);

    // items.snapshotChanges().pipe(take(1)).subscribe(item => {
    //   const data =  item.payload.data();
    //   if (item.payload.id) {
    //     console.log(data);
    //     console.log(product);
    //     items.collection('items').doc('added_products').update({ product: product, quantity: (item && data['quantity'] || 0) + 1 });
    //     //items.update({ product: product, quantity: (data['quantity'] || 0) + 1 });
    //   } else {
    //     console.log(data);
    //     console.log(product);
    //     items.collection('items').doc('added_products').set({ product: product, quantity: (item && data['quantity'] || 0) + 1 });
    //     //items.set({ product: product, quantity: (data['quantity'] || 0) + 1 });
    //   }});
  }



  private updateItem(cartId: string, productId: string) {
    return this.db.collection('shopping-carts').doc(cartId).collection('items').doc('added_products' + productId);
  }

  private async updateItemQuantity(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key);

    this.subscription = item$.pipe(take(1)).subscribe(item => {
      if (item  != null) {
        const quantity = item.quantity + change;
        // const quantity = change;
        if (quantity === 0) {this.updateItem(cartId, product.key).delete(); } else {
          this.updateItem(cartId, product.key).update({ quantity: quantity }); }
    } else {
      this.updateItem(cartId, product.key).set({ product: product, quantity: 1 });
      }
    });
  }

  //starts here:

  private createOrderId() {
    return this.db.collection('orders').add({
      dateCreated: new Date().getTime()
    });
  }
  
  private async getOrCreateOrderId(): Promise<string> {
    const orderId = localStorage.getItem('orderId');

    if (!orderId) {
      const result = await this.createOrderId();
      localStorage.setItem('orderId', result.id);
      console.log('getOrCreateOrderId()', result.id);
      
      return result.id;

    } 
    return orderId;
  }

  async getDateCreated(order: Order){
    let orderId =  await this.getOrCreateOrderId();
    let dateCreated = this.db.collection('orders').doc(orderId).get(order.dateCreated);
    return dateCreated;
  }

  async checkoutCart(order: Order){
    let orderId = await this.getOrCreateOrderId();
    this.db.firestore.collection('orders').doc(orderId).collection('cart-items').add({order});
  }

//   async updateCart(order: Order){
//     let orderId = await this.getOrCreateOrderId();
//     if(orderId != null ) {
//       this.orderCol = this.db.collection('orders').doc(orderId).collection('cart-items');
//       this.ordDoc = this.orderCol.snapshotChanges().pipe(
//         map(changes => changes.map(a => {
//           const data = a.payload.doc.data() as any;
//           data.id = a.payload.doc.id;
//           console.log('getSubcollection().data', data);
//           return data;
//         })))
//         console.log(docId);
//         //let documentId = JSON.stringify(docId);
//         this.orderDoc = this.db.doc<Order>('orders/' + orderId + '/cart-items/' + order);
//         this.orderDoc.update(order);
//   }
// }

async updateCart(order: Order){
  let orderId = await this.getOrCreateOrderId();
  if(orderId != null ) {
    this.orderCol = this.db.collection('orders').doc(orderId).collection('cart-items');
    this.ordDoc = this.orderCol.snapshotChanges().map( changes => {
      return changes.map(a => {
          const data = a.payload.doc.data() as Order;
          const id = a.payload.doc.id;
          return { id, ...data };
      });
  });

this.ordDoc.subscribe(docs => {
docs.forEach(doc => {
  let docId = doc.id
  console.log('doc.id', doc.id);
  this.orderDoc = this.db.doc<Order>('orders/' + orderId + '/cart-items/' + docId);
  this.orderDoc.set(order);
})
})

// this.orderDoc = this.db.doc<Order>('orders/' + orderId + '/cart-items/' + docId);
// this.orderDoc.update(order);

}
}

  getSubcollection(){
    const orderId = localStorage.getItem('orderId');
    if(orderId != null ) {
      var subcollection = this.db.collection('orders').doc(orderId).collection('cart-items');
      let order = subcollection.snapshotChanges().pipe(
        map(changes => changes.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          console.log('getSubcollection()', data);
          return { id, ...data }
        })))
        return order;
    }
    // var subcollection = this.db.collection('orders').doc(orderId)
    //             .collection('cart-items');
    // let order = subcollection.snapshotChanges().pipe(
    //   map(changes => changes.map(a => {
    //     const data = a.payload.doc.data() as any;
    //     const id = a.payload.doc.id;
    //     console.log('getSubcollection()', data);
    //     return { id, ...data }
        
    //   })))
    //   return order;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
