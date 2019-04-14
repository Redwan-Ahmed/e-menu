import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import * as $ from "jquery";
import { OrderService } from '../order.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
/** Here all local variables are declared in side this component.ts file */
  order$: any;
  id: string;
  orderStatus: any;

  offPeak: boolean;
  modeSubscription: Subscription;

  listTemp: any[] = [];
  prepTimeSum: number;
  statusCount: number;
  prepTimeCalculation: number = 0;

/** This allows me to call the progress bar from the .html file.
  * now the local variable progressBar is set as an ElementRef.
  * ElementRef allows direct access to my native html elements. */
  @ViewChild('progressBar') progressBar: ElementRef;

  constructor(
    private cartService: ShoppingCartService,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private renderer: Renderer2,
    private orderService: OrderService,
    private authService: AuthService
  ) {
/** Allows me to get the order ID, by passing the id through the url */
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("this.id", this.id);

/** modeSubscription is subscribing to the an object 'mode' in the authService.mode function */
    this.modeSubscription = authService.mode.subscribe(modes => {
      this.offPeak = modes.offPeak;
      console.log("AppUser Off Peak", this.offPeak);
    });

/** This is the main logic for the preparation time algorithm (REFINED ALGORITHM for PROGRESS BAR)
  * First get the order by passing through the order id (this.id) in the getOrderDoc() (CartService).
*/
    if (this.id) this.cartService.getOrderDoc(this.id).subscribe(order => {
      this.order$ = order.order;
      console.log('1', this.id);
      console.log('2', this.order$);
/* orderStatus is the status of the current Order */
      this.orderStatus = this.order$.status;
      console.log('Order Status', this.orderStatus);
/* only start the algorithm when the order is active (i.e. admin starts the order) */
      if (this.order$.status === 'active') {
/** var i is the incremental value of the progress bar, it is set as 0 in the beginning */
        var i = 0
/** setInterval allows i to be set in time, to be set in seconds we set Interval rate at 1000 (line 78) */
        var counterBack = setInterval(() => {
/** Now we increment i (i++) */
          i++;
/** If i is equal to or smaller than prepTimeCalculation; 
  * we get the percentage of the total bar (i / prepTimeCalculation * 100 ), 
  * and then increment the bar in percentage by increasing the width of the bar
  * the progress bar is moved  by using renderer.setStyle which allows me to manipulate the .css file */
          if (i <= this.prepTimeCalculation) {
            let precentage = (i / this.prepTimeCalculation) * 100;
            this.renderer.setStyle(this.progressBar.nativeElement, 'width', precentage + '%');
            console.log("i", i + '%');
          } else {
/** The Completion Logic of the algorithm is done here:
  * I simply clear the progress bar (sets it back to 0).
  * Then push the order to complete (change order status to "completed"), via orderService.completeOrder() function.
 */
            clearInterval(counterBack);
            this.orderService.completeOrder(this.id);
          }
        }, 1000); //1000 = interval seconds, 100 = interval minutes...
      }
    });
  }

/** This method get the total quantity of products added to the order, to be displayed in the .html file */
  totalQuantity(count: number) {
    count = 0;
    for (let id in this.order$.product)
      count += this.order$.product[id].quantity;
    return count;
  }
/** This method get the total cart price of the order, so it can be displayed in the .html file */
  getTotalCartPrice() {
    let sum;
    sum = this.order$.product.map(a => a.price * a.quantity)
    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    return totalCartPrice;
  }
/** The totalPrepTime of the current order is calculated here;
  * Simply by adding the prep time of each product in the order to an array then adding the total array.
*/
  getTotalPrepTime() {
    /* I had to look for a function which allows me to add numbers which is stored in an array */
    /** Source: https://stackoverflow.com/questions/50670204/sum-up-array-with-objects [Stackoverflow] **/
    let totalPrepTime = this.order$.product.reduce((totalPrepTime, a) => {
      return totalPrepTime + a.prepTime;
    }, 0);
    return totalPrepTime;
  }

  getTotalActiveOrders() {
/** This was BEFORE the algorithm was REFINED: This was how I calculated the total
 * I simply just counted active orders, I then refined this calculation and counted the PrepTime for each active order.  
*/
/* First time querying Firestore, so I visited the GitHub Firestore Docs */
/** Source: https://github.com/angular/angularfire2/blob/master/docs/firestore/querying-collections.md **/
/**
  * Second Attempt: I watched an online YouTube tutorial (and used StackOverflow) to check how to push the metadata into a list (array).
  * By pushing the metadata to an array I am able to count the length of the array, thus allowing me to count how many orders are active.
  * Source: https://www.youtube.com/watch?v=4t2eHrFW_0M (Youtube)
  * Source: https://stackoverflow.com/questions/47113065/how-to-get-data-from-cloud-firestore-and-translate-it-into-local-usable-data-co?rq=1 (StackOverflow)
*/
    const totalActiveOrders = this.db.collection('orders', ref =>
      ref.where('order.status', '==', 'active'));
    totalActiveOrders.get().toPromise().then(snapshot => {
      const list = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        data.id = doc.id;
        list.push(data);
      });
      console.log('list', list);
      return list;
    }).catch(err => {
      console.log('Error getting documents', err);
    });
  }

  ngOnInit() {
/* REDEFINED calculation of total active orders, this calculation counts all the total prep time of each active order*/
/** totalActiveOrders: counts all the active orders in the order collection.
  * list: is a temporary array which stores all the active  
*/
    const totalActiveOrders = this.db.collection('orders', ref =>
      ref.where('order.status', '==', 'active'));
    totalActiveOrders.get().toPromise().then(snapshot => {
      const list = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        data.id = doc.id;
        list.push(data);
      });
      this.listTemp = list;
      let otherOrderPrepTime = 0;
      list.forEach(order => {
        order.order.product.forEach(product => {
/** For each active order, we have time, which stores product.prepTime * product.quantity
  * We have otherOrderPrepTime which stores the prepTime of the other active orders,
  * Then add time with otherOrderPrepTime to give us the total prep time for all active orders
*/
          let time = product.prepTime * product.quantity;
          otherOrderPrepTime = otherOrderPrepTime + time;
        });
      });
      this.prepTimeSum = this.getTotalPrepTime();
      console.log("PrepSum", this.prepTimeSum);
/** we now add the current orders prep time with the otherOrderPrepTime, giving us the prepTimeCalculation! */
      this.prepTimeCalculation = otherOrderPrepTime + this.prepTimeSum;
      console.log("Calculation", this.prepTimeCalculation);

/** First Attempt using the Progress Bar: Using JQuery (I later found out about nativeElement and elementRef)
  * JQuery simply maps the .html elements into the .ts file, using $ naming conventions
  * I used this progress bar snippet code I found on a forum (StackOverflow), I then modified it to fit into my algorithm.
  * Source: https://stackoverflow.com/questions/30104289/bootstrap-progress-bar-timer?rq=1 (StackOverflow)
*/
      // var i = 0
      // var counterBack = setInterval(() => {
      //   i++;
      //   if (i < this.prepTimeCalculation){
      //     let precentage = (i / this.prepTimeCalculation) * 100;  
      //     this.renderer.setStyle(this.progressBar.nativeElement, 'width', precentage+'%');
      //     console.log("i", i+'%');

      //     // $('.progress-bar').css('width', i+'%');
      //   } else {
      //     clearInterval(counterBack);
      //   }
      // }, 1000);

    }).catch(err => {
      console.log('Error getting documents', err);
    });
  }

  ngOnDestroy() {
/** Here I destroy the subscription by unsubscribing from modeSubscription.
   * This is done to avoid memory leaks & to allows the system to detect changes so it can subscribe to new changes.
*/    
    this.modeSubscription.unsubscribe();
  }
}
