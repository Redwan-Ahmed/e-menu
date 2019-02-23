import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from  '../app/auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    return this.authService.user$.pipe(map(user => {
     if ( user ) { return true; }
 
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }));
  }

}
