import {Component, OnInit} from '@angular/core';
import {Directive, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {AuthenticationService, Resume, Student} from '../authentication.service';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {'asc': 'desc', 'desc': '', '': 'asc'};
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './admin-model.html',
  styleUrls: ['./admin-model.css']
})
export class NgbdModalContent {
  @Input() name;
  @Input() resume: Resume;

  review() {
    this.auth.updateResume(this.resume).subscribe(resume => {
      console.log('Resume is updated');
      this.resume.status = 'reviewing';
      console.log(resume);
      this.activeModal.close('Close click');
      location.href = this.resume.student_resume;
    }, (err) => {
      console.log('Error during updating resume data', err);
    });
  }

  constructor(public activeModal: NgbActiveModal, private auth: AuthenticationService) {
  }
}

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  students: Student[];

  private setResume(student: Student) {
    this.auth.student = student;
  }

  constructor(private auth: AuthenticationService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.auth.getProfiles().subscribe(students => {
      students.map(function (student) {
        if (student.resume !== undefined) {
          student.date = new Date(student.resume.submitted_date);
        } else {
          student.date = new Date();
        }

      });

      this.students = students;
      console.log(this.students);
    }, (err) => {
      console.warn(err);
    });
  }

  open(resume) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.resume = resume;
  }

  resubmit(student: Student) {
    this.auth.deleteResume(student).subscribe(user => {
      student.resume.status = 'empty';
      this.auth.resume = user.resume;
      console.log('User is updated');
      console.log(user);
    }, (err) => {
      console.log('Error during updating resume data', err);
    });
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '') {
      this.ngOnInit();
    } else {
      // this.countries = [...COUNTRIES].sort((a, b) => {
      //   const res = compare(a[column], b[column]);
      //   return direction === 'asc' ? res : -res;
      // });
      this.students = this.students.sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
