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
  dateDeletion: string;
  typeVacancy: string;
  emptySlots: string;
  filledSlots: string;
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

  onDeletion(){
    const verifyDeletion = {
      idVacancy: this.idVacancy,
      titleVacancy: this.titleVacancy,
      vacancyDesc: this.vacancyDesc,
      nameCompany: this.nameCompany,
      poID: this.poID,
      dateDeletion: this.dateDeletion,
      typeVacancy: this.typeVacancy,
      emptySlots: this.emptySlots,
      filledSlots: this.filledSlots,
      contactNo: this.contactNo,
      vacancyLocation: this.vacancyLocation,
      jobUploadedDate: this.jobUploadedDate,
      deletionComments: this.deletionComments

    }
    console.log(verifyDeletion);
  }

}
