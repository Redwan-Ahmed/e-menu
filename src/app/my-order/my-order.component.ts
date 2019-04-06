import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit, OnDestroy {
  orders$: any;
  orderSubscription: Subscription;
  monday: any[] = [];
  tuesday: any[] = [];
  wednesday: any[] = [];
  thursday: any[] = [];
  friday: any[] = [];
  saturday: any[] = [];
  sunday: any[] = [];

  selectedDay;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getAllOrders();
    this.filterDay();
  }

  getAllOrders() {
    this.orderSubscription = this.orderService.getAllOrders().subscribe(orders => {
      this.orders$ = orders;
      console.log(this.orders$);
      this.orders$.forEach(order => {
        let products = [];
        order.order.product.forEach(product => {
          let productObj = { name: product.title,  qty: product.quantity, img: product.imageUrl  }
          products.push(productObj);
        });

        if (order.order.day === "Monday") {
          this.monday = this.monday.concat(products);
          this.monday =  this.mergeSameValueArrays(this.monday);
          console.log("monday", this.monday);
          
        }

        if (order.order.day === "Tuesday") {
          this.tuesday = this.tuesday.concat(products);
          this.tuesday =  this.mergeSameValueArrays(this.tuesday);
        }

        if (order.order.day === "Wednesday") {
          this.wednesday = this.wednesday.concat(products);
          this.wednesday =  this.mergeSameValueArrays(this.wednesday);
        }

        if (order.order.day === "Thursday") {
          this.thursday = this.thursday.concat(products);
          this.thursday =  this.mergeSameValueArrays(this.thursday);
        }

        if (order.order.day === "Friday") {
          this.friday = this.friday.concat(products);
          this.friday =  this.mergeSameValueArrays(this.friday);
        }

        if (order.order.day === "Saturday") {
          this.saturday = this.saturday.concat(products);
          this.saturday =  this.mergeSameValueArrays(this.saturday);
        }

        if (order.order.day === "Sunday") {
          this.sunday = this.sunday.concat(products);
          this.sunday =  this.mergeSameValueArrays(this.sunday);
        }
      });
    });
  }

  mergeSameValueArrays(array) {
    /** First attempt on merging the 2 arrays, did not work but gave me a starting point to look for a solution
     * Source: https://stackoverflow.com/questions/24076487/combining-javascript-objects-in-an-array-with-same-key-value (StackOverflow)
     */
    // _.map(_.groupBy(array, "name"), (vals, name) => {
    //   return _.reduce(vals, (m, o) => {
    //     for (var p in o)
    //       if (p != "name")
    //         m[p] = (m[p] || 0) + o[p];
    //     return m;
    //   }, { name: name });
    // });

    /** declare an empty array to store the filtered products 
     * (products are filtered via passing through the parameter 
     * e.g. Monday array is passed thorugh thus only monday products are in array)*/
    let tempArray = [];
    //declared an sorted array to filter the tempArray (qty in descending order)
    let sorted = [];
    /** using Loadash to group the products in the array(array passed in the parameter)
     * now the groupedProducts will group the array like this ["name": Steak, "qty": 1]
     * line 111: this stores each element in the recursive algorithm, and if that element exists then add the qty of that element to that qty in the array.
    */
    let groupedProducts = _.groupBy(array, "name");
    Object.keys(groupedProducts).forEach((key) => {
      let product = { name: key, qty: 0 };
      let qty = 0;
      groupedProducts[key].forEach(element => {
        qty = qty + element.qty;
      });
      // the temp array now stores all the products name and qty of the array (passed thorugh parameter)
      // the temp array will look like this ["name": Steak, "qty": 1, "name": Coke, "qty": 5, "name": Ice Cream, "qty": 3]
      tempArray.push({ name: key, qty: qty, img: groupedProducts[key][0].img});
      console.log('temp Array', tempArray);
      /** now the temp array needs to be sorted in the highest qty (most popular product) being displayed first (head of the alogirhtm)
       * and the lowest qty (least popular product) at the tail of the array
       * this was done by using the orderBy function in Loadash; I then specified "['desc']" to make the qty in decending order 
       * Source 1: https://stackoverflow.com/questions/51088104/lodash-orderby-gives-typeerror-t-is-not-a-function-after-minification (StackOverflow)
       * Source 2: https://stackoverflow.com/questions/22928841/lodash-multi-column-sortby-descending (StackOverflow) */

      sorted = _.orderBy(tempArray, [(data) => data.qty], ['desc']);
      console.log('sorted', sorted);
      
      /** This was my first attempt in trying to sort the temp array in decending order based on the qty
       *  This did not work due to updates in the Loadash Library, to sort by decending order there is a new function called OrderBy
       * Source: https://lodash.com/docs/4.17.11#sortBy (Loadash Library Docs)
       */
      // _.sortby(tempArray, [function(o) {return o.name}]);
      // _.sortby(tempArray, ['name', 'qty']);
    });
    return sorted;

  }

  filterDay() {
    /**
     * Was able to get the value of the selecter by looking into HTMLInputElement;
     * which gets the option value in the HTML Selector field and stores it as a string
     * therefore allows me to check what day the user is selecting
     * Source: https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
     */
    const inputElement: HTMLInputElement = document.getElementById("inputGroupSelect01") as HTMLInputElement;
    const inputValue: string = inputElement.value;
    console.log(inputValue);
    this.selectedDay = inputValue;
    // console.log(this.orders$);
    // let filter = this.orderService.filterByDay();
    // console.log(filter);

  }

  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
  }

}
