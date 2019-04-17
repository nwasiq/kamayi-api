import { Component } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
    private _flashMessagesService: FlashMessagesService
  ) { }

  jobDeletionInfo = [
    {id: '1', vacancyTitle: 'Intern Mechanics', companyName: 'Honda Atlas', deletionDate: '01/01/2019', poName: 'Ahmad Ali', vacancyType: 'Electricians', filled:'50%', status: 'Pending', action: 'Verify'},
    {id: '2', vacancyTitle: 'Helper Required', companyName: 'Osaka Batteries', deletionDate: '11/03/2019', poName: 'Ilyas Muhammad', vacancyType: 'Mechanics', filled:'80%', status: 'Pending', action: 'Verify'},
    {id: '3', vacancyTitle: 'Intern Mechanics', companyName: 'Toyota GLI', deletionDate: '21/10/2019', poName: 'Anwar Ali', vacancyType: 'Electricians', filled:'75%', status: 'Deleted', action: 'Verify'},
    {id: '4', vacancyTitle: 'Helper Required', companyName: 'Nixon Tyres', deletionDate: '31/12/2019', poName: 'Syed Ali', vacancyType: 'Mechanics', filled:'100%', status: 'Deleted', action: 'Verify'}
  ];

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
