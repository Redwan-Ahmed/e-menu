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

  orderCollection: AngularFirestoreCollection<Order>;
  orders: Observable<Order[]>;

  filterCollection: AngularFirestoreCollection<Order>;

  orderDoc: AngularFirestoreDocument<any>;
  ordDoc: Observable<any>;


  constructor(private db: AngularFirestore) {
    this.orderCollection = this.db.collection('orders');
   }

   getAllOrders() {
    let orders = this.orderCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Order;
        const id = a.payload.doc.id;
        return { id, ...data }
      })))

    return orders;
  }

  startOrder(orderId){
    this.orderDoc = this.db.doc<any>('orders/' + orderId);
    this.orderDoc.update({"order.status": "active"});
  }

  completeOrder(orderId){
    this.orderDoc = this.db.doc<any>('orders/' + orderId);
    this.orderDoc.update({"order.status": "completed"});
  }

  filterByDay(){
    this.filterCollection = this.db.collection('orders/', ref => ref.where('order.day', '==', 'Monday'));
    console.log(this.filterCollection);
  }
  
}
