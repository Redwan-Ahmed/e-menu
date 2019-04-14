import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'oshop';
  
/** Some code has been re-used from my Udemy Course; Section 11, lecture 149
 * Source: https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7501702?start=0 [Udemy]
*/
  constructor(private userService: UserService, private authService: AuthService, router: Router){
/** Here we subscribe to the user, through the authService, and save the user in the local storage */
    authService.user$.subscribe(user => {
      if (!user) return;
        userService.save(user);

        let returnUrl = localStorage.getItem('returnUrl');
        if (!returnUrl) return;

        localStorage.removeItem('returnUrl');
        router.navigateByUrl(returnUrl);
    });
  }
}
