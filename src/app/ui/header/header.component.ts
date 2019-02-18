import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../authentication.service";
import {ProfileServer} from "../../profile.server";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public  isCustomized:boolean = false;
  constructor(public auth: AuthenticationService) {}

  ngOnInit() {
  }

}
