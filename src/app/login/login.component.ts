import { AuthService } from  '../auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public authService: AuthService) { }

/** The login() method is called in the .html file (Login with Google button),
  * This method simply calls the AuthService and uses the GoogleAuth() method to login.
*/
  login(){
    this.authService.GoogleAuth();
  }

}
