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
 
  canActivate(): Observable<boolean> {
    return this.authService.appUser$
    .pipe(map(AppUser => AppUser.isAdmin));
    }

}
