import {Component} from '@angular/core';
import {AuthenticationService, Profile, Student, UserDetails} from '../authentication.service';
import {HeaderComponent} from "../ui/header/header.component";

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  student: Student;
  isDataLoaded: boolean = false;
  constructor(private auth: AuthenticationService, private header: HeaderComponent) {
  }

  ngOnInit() {
    this.auth.getProfile().subscribe(object =>{
      this.student = object;
      console.log(this.student.profile);
      if(this.student.profile !== undefined){
        this.header.isCustomized = true;
      }
      this.isDataLoaded = true;
    }, (err) => {
      console.error(err);
    });
  }


  public isTraditionalResume = true;
  public isCybertekResume = true;

  profile: Profile = {
    resumeType: '',
    experience: '',
    education: '',
    locationHistory: '',
    specificClient: '',
    specificClientAvoid: ''
  }

  addProfile() {
    console.log("Adding profile..");
    this.profile.resumeType = this.isTraditionalResume ? 'CybertekResume' : 'TraditionalResume',
      console.log(this.profile);
    this.auth.addProfile(this.profile).subscribe(() => {
      this.ngOnInit();
      console.log("profile.. done");
    }), (err) => {
      console.error(err);
    }
  }
}
