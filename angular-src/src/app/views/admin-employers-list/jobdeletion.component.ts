import { Component } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CrudService } from '../../../services/crud/crud.service';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'jobdeletion.component.html'
})
export class JobdeletionComponent {

  busy: Subscription;

  public successModal;
  search: any;
  idVacancy: number;  
  titleVacancy: string;
  vacancyDesc: string;
  nameCompany: string;
  poID: number;
  designation: string;
  typeVacancy: string;
  emptySlots: number;
  filledSlots: number;
  contactNo: string;
  vacancyLocation: string;
  jobUploadedDate: string;
  deletionComments: string;
  vacancyStatus: string;

  constructor(
    private crudService: CrudService,
    private vacancyService: VacancyService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService
  ) { }

  jobDeletionInfo: any = [];

  ngOnInit(){
    this.busy = this.vacancyService.getAllVacancies().subscribe(data => {
      this.jobDeletionInfo = data;
    })
  }

  displayVacancyDeletion(vacancy)
  {
    this.busy = this.crudService.retrieveOne('users', vacancy.employer.placementOfficer).subscribe(data => {
      this.idVacancy = vacancy._id;
      this.titleVacancy = vacancy.title;
      this.vacancyDesc = vacancy.description;
      this.nameCompany = vacancy.employer.companyName;
      this.poID = data.fullName;
      this.typeVacancy = vacancy.jobType;
      this.emptySlots = vacancy.totalSlots - vacancy.hired;
      this.filledSlots = vacancy.hired;
      this.contactNo = vacancy.employer.companyPhone;
      this.vacancyLocation = vacancy.city;
      this.jobUploadedDate = vacancy.dateCreated;
      this.designation = vacancy.designation;
      this.vacancyStatus = vacancy.status
    })
    // console.log(vacancy._id);
  }

  onDeletion(){
    // const verifyDeletion = {
    //   idVacancy: this.idVacancy,
    //   titleVacancy: this.titleVacancy,
    //   vacancyDesc: this.vacancyDesc,
    //   nameCompany: this.nameCompany,
    //   poID: this.poID,
    //   designation: this.designation,
    //   typeVacancy: this.typeVacancy,
    //   emptySlots: this.emptySlots,
    //   filledSlots: this.filledSlots,
    //   contactNo: this.contactNo,
    //   vacancyLocation: this.vacancyLocation,
    //   jobUploadedDate: this.jobUploadedDate

    // }
    // console.log(verifyDeletion);

    if(this.vacancyStatus == 'Pending Archived'){
      this.vacancyStatus = 'Archived';
    }

    else if(this.vacancyStatus == 'Pending Completed'){
      this.vacancyStatus = 'Completed';
    }

    let updateObj = {
      status: this.vacancyStatus
    }

    this.busy = this.crudService.update(updateObj, 'vacancys', this.idVacancy).subscribe(data => {
      this._flashMessagesService.show("Vacancy " + this.vacancyStatus, { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function () {
        location.reload();
      }, 1000);
    })
  }

  revertJob(){
    let updateObj = {
      status: 'Active'
    }
    this.busy = this.crudService.update(updateObj, 'vacancys', this.idVacancy).subscribe(data => {
      this._flashMessagesService.show("Vacancy reverted back to Active", { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function () {
        location.reload();
      }, 1000);
    })
  }

}
