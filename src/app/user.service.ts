import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AppUser } from './models/app-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

/** Code has been re-used from mu Udemy Course; Section 20, Lecture 291
  * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7805984?start=0 [Udemy]
*/
  constructor(private db: AngularFirestore) {}
/** Here I save the user in to firebase, and notify the system user save is successful */
  save(user: firebase.User) {
    this.db.doc('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
      .then(() => console.log('User Save Successfully'))
      .catch((reason: any) => console.log('User Save Failed', reason));
  }
 
/** A simple get method to get the user data from Firebase, we return the metadata from the document accessed */
  get(uid: string): Observable<AppUser> {
    return this.db.doc('/users/' + uid).valueChanges() as Observable<AppUser>;
  }

}


