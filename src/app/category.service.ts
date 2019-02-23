import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './models/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryCollection: AngularFirestoreCollection<Category>;
  categories: Observable<Category[]>;

  constructor(private db: AngularFirestore) {
  //working version 1.0
    //this.categories = this.db.collection('categories').valueChanges();

    //working version 2.0
  //   this.categories = this.db.collection('categories').snapshotChanges().pipe(
  //     map(changes => changes.map(a => {
  //         const data = a.payload.doc.data() as Category;
  //         const id = a.payload.doc.id;
  //         return { id, ...data}
  // })))

  //working version 3.0
  this.categoryCollection = this.db.collection('categories', ref => ref.orderBy('name', 'asc'));

  this.categories = this.categoryCollection.snapshotChanges().pipe(
    map(changes => changes.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, ...data}
      })))

  }

  getCategory() {
    return this.categories;
  }

}
