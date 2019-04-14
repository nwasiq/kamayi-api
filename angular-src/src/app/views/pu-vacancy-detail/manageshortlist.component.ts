import { Component } from '@angular/core';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { convertToString } from  '../../../services/convertEducation';

@Component({
  templateUrl: 'manageshortlist.component.html'
})
export class ManageshortlistComponent {

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
    private crudService: CrudService
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

    this.crudService.retrieveOne("vacancys",this.vacancyId).subscribe(data => {
      if(data.message){
        alert(data.message);
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
        alert("No candidates are shortlisted.");
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
  }

  updateShortList(){
    if(this.candidatesInfo.length == 0)
    {
      alert("No candidates to shortlist.");
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
      alert("No candidate selected.");
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
        alert(data.message);
      }
      else{
        alert("Successfully updated status.");
        window.location.reload();
      }
    })
    console.log(updateObj);
  }

  goToGeneratedList(){
    this.route.navigate(['/pu-vacancy-detail/managecriteria/' + this.vacancyId]);
  }

}
