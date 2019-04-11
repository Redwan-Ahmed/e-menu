import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { Order } from './models/order';
import 'rxjs/add/operator/map'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
/** Here all local variables are declared in side this component.ts file */
  orderCollection: AngularFirestoreCollection<Order>;
  orders: Observable<Order[]>;
  filterCollection: AngularFirestoreCollection<Order>;
  orderDoc: AngularFirestoreDocument<any>;
  ordDoc: Observable<any>;

  constructor(private db: AngularFirestore) {
  /** orderCollection sets the collection path in Firebase */
    this.orderCollection = this.db.collection('orders');
   }
/** This method allows me to pull all the orders from the database (Firebase) */
   getAllOrders() {
    let orders = this.orderCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Order;
        const id = a.payload.doc.id;
        return { id, ...data }
      })))
    return orders;
  }
/** This method allows me to start an order by changing it's status to "active" */
  startOrder(orderId){
    this.orderDoc = this.db.doc<any>('orders/' + orderId);
    this.orderDoc.update({"order.status": "active"});
  }
/** This method allows me to complete an order by changing it's status to "completed" */
  completeOrder(orderId){
    this.orderDoc = this.db.doc<any>('orders/' + orderId);
    this.orderDoc.update({"order.status": "completed"});
  }
/** This method I was testing the queries .where function in firebase */
  filterByDay(){
    this.filterCollection = this.db.collection('orders/', ref => ref.where('order.day', '==', 'Monday'));
    console.log(this.filterCollection);
  }
}
