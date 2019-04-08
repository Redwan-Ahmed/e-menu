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
  appUser: AppUser;
  offPeak: boolean;
  userId: any;

  subscription: Subscription;

  constructor(private authService: AuthService) { 
    // authService.appUser$.subscribe(appUser => this.appUser = appUser);

    this.subscription = authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
      this.offPeak = appUser.offPeak;
      console.log("AppUser Off Peak, Nav Bar", this.offPeak);
      this.userId = appUser.uid;
      console.log("AppUser ID, Nav Bar", this.userId);
    });
  }

  logout(){
    this.authService.Logout();
  }

  offPeakMode(userId){
    this.authService.switchToOffPeak(this.userId);
  }

  peakTimesMode(userId){
    this.authService.switchToPeakTimes(this.userId);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}