import { AppUser } from './../models/app-user';
import { Component, OnDestroy } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { auth } from 'firebase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnDestroy {
/** Here all local variables are declared in side this component.ts file */
  appUser: AppUser;
  offPeak: boolean;
  userId: any;

  subscription: Subscription;

  modeSubscription: Subscription;

/** Some code was re-used from my Udemy Course; 
  * Source 1: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7750412?start=0 [Section 19, Lecture 280, Udemy] */
  constructor(private authService: AuthService) {
/** Line 26, The code works but was kept for reference for lines 32-42 */
    // authService.appUser$.subscribe(appUser => this.appUser = appUser);

/** subscription is subscribing to appUser in the users collection in firebase.
   *  This is done by calling the AuthService, which then allows me to use appUser$ function, which I then subscribe to.
   *  the variable appUser then stores the user, so that it can then be called upon.
*/
    this.subscription = authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
/** First attempt for switching modes, failed because the mode was being assigned to a user, 
  * The logic was wrong because the mode will only change if the admin is logged in, since the mode is assigned to the user collection.
  * Solution: store mode in its own collection, but only allow modes to be changed if admin is logged in.
*/
      // this.offPeak = appUser.offPeak;
      // console.log("AppUser Off Peak, Nav Bar", this.offPeak);
      this.userId = appUser.uid;
      console.log("AppUser ID, Nav Bar", this.userId);
    });
/** modeSubscription is subscribing to offPeak (field) in the modes collection in firebase.
   *  This is done by calling the AuthService, which then allows me to use mode function, which I then subscribe to.
   *  the variable offPeak then stores the modes.offPeak, so that it can then be called upon.
*/
    this.modeSubscription = authService.mode.subscribe(modes => {
      this.offPeak = modes.offPeak;
      console.log("AppUser Off Peak, Nav Bar", this.offPeak);
    });
  }

/** The logout() function calls the Authservice to Logout(), which is triggered by the logout dropdown anchor(<a>)*/
  logout(){
    this.authService.Logout();
  }
/** The offPeakMode() function calls the Authservice to switchToOffPeak().
  * which is triggered by clicking PeakTimes button, as it sets offPeak to true. */
  offPeakMode(userId){
    this.authService.switchToOffPeak(this.userId);
  }
/** The peakTimesMode() function calls the Authservice to switchToPeakTimes().
  * which is triggered by clicking offPeak button, as it sets offPeak to false. */
  peakTimesMode(userId){
    this.authService.switchToPeakTimes(this.userId);
  }

  ngOnDestroy() {
/** Here I destroy the subscription by unsubscribing from subscription and modeSubscription.
   * This is done to avoid memory leaks, 
   * and to allow us to detect changes so it can unsubscribe and then subscribe to new changes.
*/
    this.subscription.unsubscribe();
    this.modeSubscription.unsubscribe();
  }
}