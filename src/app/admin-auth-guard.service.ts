import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AdminAuthGuard implements CanActivate {
 
  constructor(private authService: AuthService, private userService: UserService) { }

/** This component.ts file has been reused from my Udemy Course; Section 20, Lecture 296
  * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7805998?start=15 [Udemy]
 */
  canActivate(): Observable<boolean> {
    return this.authService.appUser$
/** Here we just check if the path the user is navigated to is admin route protected, if so then we check if user isAdmin */
    .pipe(map(AppUser => AppUser.isAdmin));
    }

}
