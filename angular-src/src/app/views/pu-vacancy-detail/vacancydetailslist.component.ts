import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { convertToString } from  '../../../services/convertEducation';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'vacancydetailslist.component.html'
})
export class VacancydetailslistComponent {

  busy: Subscription;

  vacancyId: any;
  hired: number;
  openings: number;
  totalSlots: number;
  occupation: string;
  employer: string;

  date: Date = new Date();
  
  statusName: string;
  vacancyOccupation: any;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private vacancyService: VacancyService,
    private crudService: CrudService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  candidatesInfo: any[] = [];

  status = ['Schedule Interview', 'Interview Scheduled', 'Interviewed', 'Rejected', 'Hired', 'Joined'];

  shortListCandidatesIds: any = [];

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
      this.vacancyId = params['id']
    );
    
    this.busy = this.crudService.retrieveOne("vacancys",this.vacancyId).subscribe(data => {
      console.log("vacancyID: ", this.vacancyId);
      console.log("vacancy", data);
      if(data.message){
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        this.route.navigate(['/pu-open-vacancy/openvacancy']);
      }
      else
      {
        this.crudService.retrieveOne("employers", data.employer).subscribe(data2 => {
          console.log("employer", data2);
          this.occupation = data.occupation;
          this.employer = data2.companyName;
          this.hired = data.hired;
          this.openings = data.openings;
          this.totalSlots = data.totalSlots;

          let occupation = localStorage.getItem('occupation');
          this.busy = this.vacancyService.getShortListForVacancy(this.vacancyId, occupation).subscribe(data => {
            console.log("shortlist", data);
            if(data.length == 0){
              this._flashMessagesService.show("No candidates are shortlisted.", { cssClass: 'alert-danger text-center', timeout: 1000 });
              this._flashMessagesService.grayOut(true);
              // alert("No candidates are shortlisted.");
              return;
            }
            for(let candidate of data){
              candidate.education = convertToString(candidate.education);
              for(let i = 0; i < candidate.candidate.vacancyStatus.length; i++){
                if(this.vacancyId == candidate.candidate.vacancyStatus[i].vacancy){
                  if(candidate.candidate.vacancyStatus[i].status == 'Interview Scheduled'){
                    candidate.candidate.status = candidate.candidate.vacancyStatus[i].status;
                    candidate.candidate.interviewTime = candidate.candidate.vacancyStatus[i].interviewDate;
                  }
                  else{
                    candidate.candidate.status = candidate.candidate.vacancyStatus[i].status;
                  }
                  break;
                }
              }
            }
            this.candidatesInfo = data;
            console.log(data);
          });

        })
      }
    })

    
  }

  viewManageVacancy(){
    this.route.navigate(['/pu-vacancy-detail/managecriteria/' + this.vacancyId]);
  }
}
