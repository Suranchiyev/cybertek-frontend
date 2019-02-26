import {Component, OnInit} from '@angular/core';
import {AuthenticationService, Profile, Student, UserDetails} from '../../authentication.service';


@Component({
  selector: 'app-profile-experience',
  templateUrl: 'profile.component.experience.html',
  styleUrls: ['profile.component.experience.css'],
})
export class ExpirienceComponent implements OnInit {
  ngOnInit() {
    this.populateYears();
  }

  populateYears() {
    const date = new Date();
    const year = date.getFullYear();
    const yearSelect = document.querySelectorAll('.year');

    for (let i = 0; i <= 20; i++) {
      const optionOne = document.createElement('option');
      const optionTwo = document.createElement('option');
      optionOne.textContent = year - i;
      optionTwo.textContent = year - i;
      optionOne.setAttribute('value', `${year - i}`);
      optionTwo.setAttribute('value', `${year - i}`);
      yearSelect[0].appendChild(optionOne);
      yearSelect[1].appendChild(optionTwo);
    }
  }

}
