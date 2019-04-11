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
/** This allows me to get all categories in the category collection */
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
