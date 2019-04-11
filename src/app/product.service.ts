import { Product } from './models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
/** Here all local variables are declared in side this component.ts file */
  productCollection: AngularFirestoreCollection<Product>;
  products: Observable<Product[]>;

  productDoc: AngularFirestoreDocument<Product>;
  prodDoc: Observable<Product>;

  constructor(private db: AngularFirestore) {
/** Setting the productCollection path for firebase */    
    this.productCollection = this.db.collection('products');
  }
/** This method adds a new product to the product collection */
  create(product: Product) {
    this.db.collection('products').add(product);
  }
/** This method gets ALL the products from the products collection */
  getAll() {
    let products = this.productCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data }
      })))
    return products;
  }
/** This method returns a single product from the product collection */
  getProduct(productId) {
    this.productDoc = this.db.doc<Product>('products/' + productId);
    this.prodDoc = this.productDoc.valueChanges();
    return this.prodDoc;
  }
/** This method uodates an existing product by using the update() function and passing through the product */
  updateProduct(productId, product) {
    this.productDoc = this.db.doc<Product>('products/' + productId);
    this.productDoc.update(product);
  }
/** This method deletes an existing product by using the delete() function and passing through the product */
  deleteProduct(productId) {
    this.productDoc = this.db.doc<Product>('products/' + productId);
    this.productDoc.delete();
  }
}
