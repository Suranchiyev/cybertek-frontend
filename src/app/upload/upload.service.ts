import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse, HttpHeaders, HttpParams
} from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import {AuthenticationService} from "../authentication.service";
import {environment} from '../../environments/environment';



@Injectable()
export class UploadService {
  endpoint: string = environment.APIEndpoint;
  private token : string;
  constructor(private http: HttpClient, public auth: AuthenticationService) {
  }

  private getToken(): string {
    this.token = localStorage.getItem('mean-token');
    console.log('Token '+this.token);
    return this.token;
  }

  public upload(
    files: Set<File> , params: HttpParams
  ): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);


      // create a http-post request and pass the form
      // tell it to report the upload progress
      const headers = new HttpHeaders({'Authorization' : `Bearer ${this.getToken()}`});
      const req = new HttpRequest("POST", this.endpoint, formData, {
        reportProgress: true,
        headers : headers,
        params: params
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      let startTime = new Date().getTime();


     this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          var obj: any = event.body;
          this.auth.getResume()._id = obj._id;
          this.auth.getResume().status = obj.status;
          this.auth.getResume().student_resume = obj.student_resume;

          // this.resume.userId = obj.user;
          // this.resume.status = obj.status;
          // this.resume.student_resume = obj.student_resume;

          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
