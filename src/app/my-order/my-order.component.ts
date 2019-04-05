import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  filterDay(){
    // let e = document.getElementById("inputGroupSelect01");
    // var value = e.options[e.selectedIndex].value;
    const inputElement: HTMLInputElement = document.getElementById("inputGroupSelect01") as HTMLInputElement;
    const inputValue: string = inputElement.value;
    console.log(inputValue);
  }

}
