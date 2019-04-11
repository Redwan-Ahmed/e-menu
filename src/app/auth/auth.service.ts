import { Injectable, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "../shared/services/user";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { AppUser } from '../models/app-user';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of'; 
import { Mode } from '../models/mode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
/** Here all local variables are declared in side this component.ts file */
  userData: any; // Logged in user has their data stored in this variable
  user$: Observable<firebase.User>; 

  userDoc: AngularFirestoreDocument<any>;

  modesDoc: AngularFirestoreDocument<Mode>;
  modeDoc: Observable<Mode>;

/** For user Authentication and Authorization has been Sourced from the following links bellow:
  * Source 1: https://www.positronx.io/save-user-data-in-local-storage-using-angular-7-firebase/ [positronx.io]
  * Source 2: https://angular-templates.io/tutorials/about/firebase-authentication-with-angular [angular-templates.io]
  * Source 3: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7805976?start=195 [Udemy Course (Section 20, Lectures 286-298)]
  * Note: Sources 2 and 3 were not re-used as much;
  *       my Udemy Course was slightly outdated this is due to rapid changes in Angular & Firebase.
  *       Source 1 was used mostly during the implementation phase, old code used is commented out.
  */
  constructor(
    private db: AngularFirestore,
    private userService: UserService, // The user.service is localised here as userService
    public afs: AngularFirestore,   // Inject the Firestore service here
    public afAuth: AngularFireAuth, // Inject the Firebase auth service here
    public router: Router,  
    public ngZone: NgZone, // NgZone service is used to remove outside scope warning syntax/notifications
    private route: ActivatedRoute
    ){

/* An early attempt which did not work, kept here for reference */
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user'));
    //   } else {
    //     localStorage.setItem('user', null);
    //     JSON.parse(localStorage.getItem('user'));
    //   }
    // })

/** Here users$ is saved to authState which is an Observable stored in AngularFireAuth (Injectable) */
    this.user$ = this.afAuth.authState;
   }

/* This Function returns true when the user is looged in and email is verified */
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

/* The sign in with google method is declared here, I used Source 1 (Line: 31) & Firebase Docs
   Source: https://firebase.google.com/docs/auth/web/google-signin [Google Firebase] */
  GoogleAuth() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

/** Failed attempt to sign in with Google, but kept here for reference */
    // GoogleAuth() {
    //   this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    // }

/** The Authorization logic to run auth provider. 
  * This code allows Google to authorise the login by pushing a pop up page where the user types thier credentials.
  * The pop up function is called signInWithPopup (line 88) which passes the provider as the parameter */
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

/* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
/** The return of this function sets (pushes) the data into firebase */
    return userRef.set(userData, {
      merge: true
    })
  }


/** Failed attempt to sign out with Google, but kept here for reference */
  // SignOut() {
  //   return this.afAuth.auth.signOut().then(() => {
  //     localStorage.removeItem('user');
  //     this.router.navigate(['']);
  //   })
  // }

/** This function allows the user to sign out, by calling the AngularFireAuth > auth > signOut() */
  Logout() {
    this.afAuth.auth.signOut();
  }

/** A getter, which allows the system to pull user data from firebase  */
  get appUser$() : Observable<AppUser> {
    return this.user$
      .switchMap(user => {
        if (user) return this.userService.get(user.uid);

        return Observable.of(null);
      });    
  }

/** The switch mode functions are done here for both OffPeak (Line: 143) and PeakTimes(Line: 148), 
  * Y8oRoRkV0sqpZn11zKQU is a Document ID which is fixed or hard coded
  * this is because we only want to access this document at ALL times, and only manipulate this document.
  * To change the mode, we call the update({}) function, in order to update that docuement;
  * update({}) function is used in line 148 and 153. */
  switchToOffPeak(userId){
    this.userDoc = this.db.doc<any>('modes/Y8oRoRkV0sqpZn11zKQU');
    this.userDoc.update({offPeak: true});
  }

  switchToPeakTimes(userId){
    this.userDoc = this.db.doc<any>('modes/Y8oRoRkV0sqpZn11zKQU');
    this.userDoc.update({offPeak: false});
  }

/** A getter, to get the current mode, which is stored in firebase (collection "modes/") */
  get mode(){
    this.modesDoc = this.db.doc<Mode>('modes/Y8oRoRkV0sqpZn11zKQU');
    this.modeDoc = this.modesDoc.valueChanges();
    return this.modeDoc;
  }

}
