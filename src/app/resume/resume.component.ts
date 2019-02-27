import {Component, Injectable, OnInit} from '@angular/core';
import {AuthenticationService, Resume} from '../authentication.service';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  constructor(private auth: AuthenticationService) {
  }

  private resume: Resume = this.auth.getResume();

  ngOnInit() {
    this.auth.getProfile().subscribe(object => {
      if (object.resume != null) {
        this.resume = object.resume;
        this.auth.resume = this.resume;
        // this.auth.getResume()._id = this.resume._id;
        // this.auth.getResume().status = this.resume.status;
      }
    }, (err) => {
      console.error(err);
    });
  }

}
