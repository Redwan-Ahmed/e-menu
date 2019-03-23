import { Product } from './product';
import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
    items: ShoppingCartItem[] = [];
  
    constructor(private itemsMap: { [productId: number]: ShoppingCartItem }) {
      this.itemsMap = itemsMap || {};
      // tslint:disable-next-line:forin
      for (const productId in itemsMap) {
        const item = itemsMap[productId] as any;
        this.items.push(new ShoppingCartItem(item.payload.doc.data().product, item.payload.doc.data().quantity,
        item.payload.doc.data().product.firebaseId));
      }
    }
  
      // REVISE - ALSO IN ProductQuantity
      getQuantity(product: Product) {
          let quant = 0;
          this.items.forEach(element => {
             if (element.key === product.key) {
              quant = element.quantity;
            }
          });
          return quant;
      }
  
      get totalPrice() {
        let sum = 0;
        // tslint:disable-next-line:forin
        for (const productId in this.items) {
          sum += this.items[productId].totalPrice;
        }
        return sum;
      }
  
    get totalItemsCount() {
      let count = 0;
      // tslint:disable-next-line:forin
      for (const each in this.items) {
        count += this.items[each].quantity;
      }
      return count;
    }
  }