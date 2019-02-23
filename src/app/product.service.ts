import { Product } from './models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productCollection: AngularFirestoreCollection<Product>;
  products: Observable<Product[]>;

  productDoc: AngularFirestoreDocument<Product>;
  prodDoc: Observable<Product>;

  constructor(private db: AngularFirestore) {
    this.productCollection = this.db.collection('products');

    // this.products = this.productCollection.snapshotChanges().pipe(
    //   map(changes => changes.map(a => {
    //     const data = a.payload.doc.data() as Product;
    //     const id = a.payload.doc.id;
    //     return { id, ...data }
    //   })))
  }

  create(product: Product) {
    this.db.collection('products').add(product);
  }

  getAll() {
    let products = this.productCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data }
      })))

    return products;
  }

  getProduct(productId) {
    //Using a Document to get a single data
    this.productDoc = this.db.doc<Product>('products/' + productId);
    this.prodDoc = this.productDoc.valueChanges();
    return this.prodDoc;
    //this works too
    // return this.db.doc<Product>('products/' + productId).valueChanges();
  }

  updateProduct(productId, product) {
    this.productDoc = this.db.doc<Product>('products/' + productId);
    this.productDoc.update(product);
  }

  deleteProduct(productId) {
    this.productDoc = this.db.doc<Product>('products/' + productId);
    this.productDoc.delete();
  }

}
