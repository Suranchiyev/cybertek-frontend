import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {Router} from '@angular/router';
import {AuthenticationService, Profile} from "./authentication.service";

@Injectable()
export class ProfileServer {
  private token: string;
  constructor(private http: HttpClient, private router: Router){
  }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public checkProfile(): Observable<any> {
    let base = this.http.get(`/api/profile`,{headers: {Authorization: `Bearer ${this.getToken()}`}});
    const request = base.pipe(
      map((data: Object) => {
        console.log(data);
        return data;
      })
    );
    return request;
  }
  public isProfileCustomized(): boolean{
    const data = this.checkProfile().subscribe(object => {
      return object.profile != null;
    });
    return false;
  }
}
