import { Product } from './models/product';
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
  ordDoc: Observable<any>;

  orderCol: AngularFirestoreCollection<Order>;

  order$: Order;


  constructor(private db: AngularFirestore) { }

  checkoutCart(order: Order){
    return new Promise((resolve, reject) => {
      this.db.firestore.collection('orders').add({order}).then(res => {
        resolve (res.id);
      });
    });
  }

//** get a subcollection data in firebase: no longer needed but kept for an example */
  // getSubcollection(){
  //   const orderId = localStorage.getItem('orderId');
  //   if(orderId != null ) {
  //     var subcollection = this.db.collection('orders').doc(orderId).collection('cart-items');
  //     let order = subcollection.snapshotChanges().pipe(
  //       map(changes => changes.map(a => {
  //         const data = a.payload.doc.data() as any;
  //         const id = a.payload.doc.id;
  //         console.log('getSubcollection()', data);
  //         return { id, ...data }
  //       })))
  //       return order;
  //   }
  // }

  // This allows me to get a document stored in the orders collection, passing through the orderId via Url
  getOrderDoc(orderId) {
    this.orderDoc = this.db.doc('orders/' + orderId);
    this.ordDoc = this.orderDoc.valueChanges();
    return this.ordDoc;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
