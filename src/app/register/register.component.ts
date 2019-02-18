import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector:'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {
  isAdmin: boolean = false;
  isValidForm: boolean = true;
  isPasswordsMatch: boolean = true;

  private registerAsAdmin(){
    if(this.isAdmin === false){
      this.isAdmin = true;
    }else{
      this.isAdmin = false;
    }
  }

  confirmPassword: string;

  credentials: TokenPayload = {
    email: '',
    first_name: '',
    last_name:'',
    role:'student',
    visa: '',
    study_course:'',
    batch_number:'',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    if(this.isAdmin){
      console.log(this.isAdmin);
      this.credentials.role = 'admin';
      this.credentials.visa = '';
      this.credentials.study_course = '';
      this.credentials.batch_number = '';
      if(this.credentials.first_name === '' ||
         this.credentials.last_name  === '' ||
         this.credentials.email  === '' ||
         this.credentials.password  === ''||
         this.confirmPassword  === ''){
        this.isValidForm = false;
      }else{
        this.isValidForm = true;
        if(this.confirmPassword === this.credentials.password){
          this.isPasswordsMatch = true;
          this.registerUser(this.credentials);
        }else{
          this.isPasswordsMatch = false;
        }

      }
    }else{
      if(this.credentials.first_name === '' ||
        this.credentials.last_name  === '' ||
        this.credentials.email  === '' ||
        this.credentials.password  === '' ||
        this.confirmPassword  === '' ||
        this.credentials.visa  === '' ||
        this.credentials.study_course  === '' ||
        this.credentials.batch_number  === ''){
        this.isValidForm = false;
      }else{
        this.isValidForm = true;
        if(this.confirmPassword === this.credentials.password){
          this.isPasswordsMatch = true;
          this.registerUser(this.credentials);
        }else{
          this.isPasswordsMatch = false;
        }
      }
    }
  }

  private registerUser(credentials){
    this.auth.register(credentials).subscribe((user) => {
      console.log(user.role);
      if(user.role === 'admin'){
        this.router.navigateByUrl('/admin-profile');
      }else{
        this.router.navigateByUrl('/profile');
      }
    }, (err) => {
      console.error(err);
    });
  }
}
