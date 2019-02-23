import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AppUser } from './models/app-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  constructor(private db: AngularFirestore) {}
 
  save(user: firebase.User) {
    this.db.doc('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
      .then(() => console.log('User Save Successfully'))
      .catch((reason: any) => console.log('User Save Failed', reason));
  }
 
  get(uid: string): Observable<AppUser> {
    return this.db.doc('/users/' + uid).valueChanges() as Observable<AppUser>;
  }

}


