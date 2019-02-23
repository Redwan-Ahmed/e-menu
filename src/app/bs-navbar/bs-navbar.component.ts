import { AppUser } from './../models/app-user';
import { Component } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { auth } from 'firebase';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent {
  appUser: AppUser;

  constructor(private authService: AuthService) { 
    authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  logout(){
    this.authService.Logout();
  }

}