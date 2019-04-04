import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import * as $ from "jquery";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

  order$: any;
  id: string;

  listTemp: any[] = [];
  prepTimeSum: number;
  statusCount: number;
  prepTimeCalculation: number;

  constructor(
    private cartService: ShoppingCartService,
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) { 
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("this.id", this.id);

    //take operator allows me to take one object and no need to unsubscirbe
    if (this.id) this.cartService.getOrderDoc(this.id).take(1).subscribe(order => { 
      this.order$ = order.order; 
      console.log('1', this.id);
      console.log('2', this.order$);
      });   
    
      // /* Allows me to count the status of an order */
      // const totalProcessingOrders = this.db.collection('orders', ref => 
      // ref.where('order.status', '==', 'processing'));
      
      // totalProcessingOrders.get().toPromise().then(snapshot => {
      //   const list = [];
      //   snapshot.docs.forEach(doc => {
      //     const data = doc.data()
      //     data.id = doc.id;
      //     list.push(data);
      //   });
      //   this.listTemp = list;
      //   console.log('list', this.listTemp);
      //   return this.listTemp;
      // }).catch(err => {
      //   console.log('Error getting documents', err);
      // });

  }

  totalQuantity(count: number) {
    count = 0;
    for (let id in this.order$.product)
      count += this.order$.product[id].quantity;
    return count;
  }

  getTotalCartPrice() {
    let sum;
    sum = this.order$.product.map(a => a.price * a.quantity)
    //console.log('total', sum);
    
    const totalCartPrice = sum.reduce((totalCartPrice, sum) => totalCartPrice + sum, 0);
    //console.log('totalCartPrice', totalCartPrice);
    return totalCartPrice;
  }

  getTotalPrepTime(){
    /* I had to look for a function which allows me to add numbers which is stored in an array */
    /** Source: https://stackoverflow.com/questions/50670204/sum-up-array-with-objects **/
    let totalPrepTime = this.order$.product.reduce((totalPrepTime, a) => {
      return totalPrepTime + a.prepTime;
    }, 0);

    console.log("Total Prep Time", totalPrepTime);
    this.prepTimeSum = totalPrepTime;
    return totalPrepTime;
  }

  getTotalProcessingOrders(){
    /* First time querying Firestore, so I visited the GitHub Firestore Docs */
    /** Source: https://github.com/angular/angularfire2/blob/master/docs/firestore/querying-collections.md **/
    /**
     * Second Attempt: I watched an online YouTube tutorial (and used StackOverflow) to check how to push the metadata into a list (array).
     * By pushing the metadata to an array I am able to count the length of the array, thus allowing me to count how many orders are processing.
     * Source: https://www.youtube.com/watch?v=4t2eHrFW_0M (Youtube)
     * Source: https://stackoverflow.com/questions/47113065/how-to-get-data-from-cloud-firestore-and-translate-it-into-local-usable-data-co?rq=1 (StackOverflow)
     */

    const totalProcessingOrders = this.db.collection('orders', ref => 
    ref.where('order.status', '==', 'processing'));
    
    totalProcessingOrders.get().toPromise().then(snapshot => {
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
          /* Allows me to count the status of an order */
          const totalProcessingOrders = this.db.collection('orders', ref => 
          ref.where('order.status', '==', 'processing'));
          
          totalProcessingOrders.get().toPromise().then(snapshot => {
            const list = [];
            snapshot.docs.forEach(doc => {
              const data = doc.data()
              data.id = doc.id;
              list.push(data);
            });
            this.listTemp = list;
            console.log('list', this.listTemp);
            this.statusCount = this.listTemp.length;
            console.log('status count', this.statusCount);
            console.log("PrepSum", this.prepTimeSum);
            this.prepTimeCalculation = this.statusCount + this.prepTimeSum;
            console.log("Calculation", this.prepTimeCalculation);
            
/**
* I used this progress bar snippet code I found on a forum (StackOverflow), I then modified it to fit into my algorithm.
* Source: https://stackoverflow.com/questions/30104289/bootstrap-progress-bar-timer?rq=1 (StackOverflow)
*/
            var i = this.prepTimeCalculation;
            var counterBack = setInterval(function(){
              i++;
              if (i > 0){
                $('.progress-bar').css('width', i+'%');
              } else {
                clearInterval(counterBack);
              }
            }, 1000);
          }).catch(err => {
            console.log('Error getting documents', err);
          });


          
   }

}
