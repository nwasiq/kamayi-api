import { Component } from '@angular/core';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'manageshortlist.component.html'
})
export class ManageshortlistComponent {

  vacancyId: any;
  hired: number;
  openings: number;
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
        })
      }
    })

    let occupation = localStorage.getItem('occupation');
    this.vacancyService.getShortListForVacancy(this.vacancyId, occupation).subscribe(data => {
      if(data.length == 0){
        alert("No candidates are shortlisted.");
        return;
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
      interviewDate: ''
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
      }
    })
    console.log(updateObj);
  }

}
