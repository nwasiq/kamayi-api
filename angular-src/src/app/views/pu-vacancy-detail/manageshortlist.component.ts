import { Component } from '@angular/core';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { convertToString } from  '../../../services/convertEducation';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'manageshortlist.component.html'
})
export class ManageshortlistComponent {

  busy: Subscription;

  vacancyId: any;
  hired: number;
  openings: number;
  totalSlots: number;
  occupation: string;
  employer: string;

  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }
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

  checkAll(ev) {
    this.candidatesInfo.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    return this.candidatesInfo.every(_ => _.state);
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe( params =>
      this.vacancyId = params['id']
    );

    this.busy = this.crudService.retrieveOne("vacancys",this.vacancyId).subscribe(data => {
      if(data.message){
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        this.route.navigate(['/pu-open-vacancy/openvacancy']);
      }
      else
      {
        this.crudService.retrieveOne("employers", data.employer).subscribe(data2 => {
          this.occupation = data.occupation;
          this.employer = data2.companyName;
          this.hired = data.hired;
          this.openings = data.openings;
          this.totalSlots = data.totalSlots;
        })
      }
    })

    let occupation = localStorage.getItem('occupation');
    this.vacancyService.getShortListForVacancy(this.vacancyId, occupation).subscribe(data => {
      if(data.length == 0){
        // alert("No candidates are shortlisted.");
        this._flashMessagesService.show("No candidates are shortlisted.", { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
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
      // console.log(data);
    });
  }

  updateShortList(){
    if(this.candidatesInfo.length == 0)
    {
      // alert("No candidates to shortlist.");
      this._flashMessagesService.show("No candidates to shortlist.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      return;
    }
    
    for(let x of this.candidatesInfo){
      if(x.state)
      {
        this.shortListCandidatesIds.push(x.candidate._id);
      }
    }

    if(this.shortListCandidatesIds.length == 0)
    {
      // alert("No candidate selected.");
      this._flashMessagesService.show("No candidate selected.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      return;
    }

    let updateObj = {
      status: this.statusName,
      ids: this.shortListCandidatesIds,
      interviewDate: new Date
    }
    
    if(this.statusName == 'Interview Scheduled')
    {
      updateObj.interviewDate = this.date
    }
    this.vacancyService.updateStatusForShortList(updateObj, this.vacancyId).subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else{
        // alert("Successfully updated status.");
        this._flashMessagesService.show("Successfully updated status.", { cssClass: 'alert-success text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        setTimeout(function(){ 
          location.reload(); 
        }, 1000);
      }
    })
    // console.log(updateObj);
  }

  goToGeneratedList(){
    this.route.navigate(['/pu-vacancy-detail/managecriteria/' + this.vacancyId]);
  }

}
