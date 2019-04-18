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
      console.log(this.jobDeletionInfo);
    })
  }

  displayVacancyDeletion(vacancy)
  {
    // console.log(vacancy._id);
    this.idVacancy = vacancy._id;
    this.titleVacancy = vacancy.title;
    this.vacancyDesc = vacancy.description;
    this.nameCompany = vacancy.employer.companyName;
    this.poID = vacancy.employer.placementOfficer;
    this.typeVacancy = vacancy.jobType;
    this.emptySlots = vacancy.totalSlots - vacancy.hired;
    this.filledSlots = vacancy.hired;
    this.contactNo = vacancy.employer.companyPhone;
    this.vacancyLocation = vacancy.city;
    this.jobUploadedDate = vacancy.dateCreated;
    this.designation = vacancy.designation;
  }

  onDeletion(){
    const verifyDeletion = {
      idVacancy: this.idVacancy,
      titleVacancy: this.titleVacancy,
      vacancyDesc: this.vacancyDesc,
      nameCompany: this.nameCompany,
      poID: this.poID,
      designation: this.designation,
      typeVacancy: this.typeVacancy,
      emptySlots: this.emptySlots,
      filledSlots: this.filledSlots,
      contactNo: this.contactNo,
      vacancyLocation: this.vacancyLocation,
      jobUploadedDate: this.jobUploadedDate

    }
    console.log(verifyDeletion);
  }

}
