import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {UploadService} from '../upload.service';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../authentication.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('file') file;

  public files: Set<File> = new Set();

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public uploadService: UploadService, public auth: AuthenticationService) {
  }

  ngOnInit() {

  }

  displayErrorMessage = false;
  oneFileIsUploaded = false;
  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        console.log(files[key].type);
        if (files[key].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || files[key].type === 'application/msword') {
          this.displayErrorMessage = false;
          this.files.add(files[key]);
        } else {
          this.displayErrorMessage = true;
          this.oneFileIsUploaded = false;
        }
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
    this.oneFileIsUploaded = true;
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map

    let params = new HttpParams({
      fromObject: {
        'fileType': 'resume',
        'role': this.auth.getUserDetails().role,
        'resumeId': this.auth.student.resume === undefined ? 'undefined' : this.auth.student.resume._id,
        'profileId': this.auth.student._id,
        'name': this.auth.student.first_name + this.auth.student.last_name
      }
    });

    this.progress = this.uploadService.upload(this.files, params);

    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log('--->: ' + val));
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the xupload was successful...
      this.uploadSuccessful = true;
      this.oneFileIsUploaded = true;
      if (this.auth.isAdmin()) {
        this.auth.student.resume.status = 'completed';
      }
      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
