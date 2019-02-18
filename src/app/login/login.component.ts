import {Component, OnInit} from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector:'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  isValidForm: boolean = true;

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    if(this.credentials.email === '' || this.credentials.password === ''){
      this.isValidForm = false;
    }else{
      this.auth.login(this.credentials).subscribe(() => {
        if(this.auth.isAdmin()){
          this.router.navigateByUrl('/admin-profile');
        }else{
          this.router.navigateByUrl('/profile');
        }
      }, (err) => {
        console.error(err);
      });
    }
  }
  ngOnInit() {
     if(this.auth.isLoggedIn() && this.auth.isAdmin()){
       this.router.navigateByUrl('/admin-profile');
     }else if(this.auth.isLoggedIn()){
       this.router.navigateByUrl('/profile');
     }
  }
}
