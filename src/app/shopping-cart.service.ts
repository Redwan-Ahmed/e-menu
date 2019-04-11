import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './models/order';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService  {
/** Here all local variables are declared in side this component.ts file */
  orderDoc: AngularFirestoreDocument<Order>;
  ordDoc: Observable<any>;
  orderCol: AngularFirestoreCollection<Order>;
  order$: Order;

  constructor(private db: AngularFirestore) { }
/** This method adds an order object to the orders collection in firebase */
  checkoutCart(order: Order){
    return new Promise((resolve, reject) => {
      this.db.firestore.collection('orders').add({order}).then(res => {
        resolve (res.id);
      });
    });
  }

/** This method allows me to get a document stored in the orders collection, by passing through the orderId */
  getOrderDoc(orderId) {
    this.orderDoc = this.db.doc('orders/' + orderId);
    this.ordDoc = this.orderDoc.valueChanges();
    return this.ordDoc;
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

}
