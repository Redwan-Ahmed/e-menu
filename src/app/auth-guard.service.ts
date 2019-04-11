import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from  '../app/auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

/** Code has been re-used from my Udemy Course; Section: 20, Lecture: 292
  * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7805986?start=0 [Udemy]
 */
  constructor(public authService: AuthService, private router: Router) { }

/** canActivate method only allows logged in users to access certain pages.
 * If they want to access a page which is protected the system will redirect them to login */
  canActivate(route, state: RouterStateSnapshot) {
    return this.authService.user$.pipe(map(user => {
     if ( user ) { return true; }
 
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }));
  }

}
