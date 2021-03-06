import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { CandidateService } from '../../../services/candidate/candidate.service';
import { convertToString } from '../../../services/convertEducation';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'candidateview.component.html'
})
export class CandidateviewComponent {

  busy: Subscription;

  candidateid: string;

  name: string;
  email: string;
  phone: string;
  cnic: string;
  employmentStatus: boolean;
  primarySkill: string;
  area: string;

  totalCriteria: any = [];
  
  showDiv: boolean = false;

  gender: string;
  education: string;

  comment: string;

  constructor(
    private crudService: CrudService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
        this.candidateid = params['id']
      );
    // console.log(this.candidateid);

    if(this.candidateid){
      this.busy = this.crudService.retrieveOne("candidates", this.candidateid).subscribe(user => {
        console.log(user);
        if(user.message){
          // alert(user.message);
          this._flashMessagesService.show(user.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
          this.route.navigate(['/cc-candidates-list/candidate']);
        }
        else{
          this.name = user.fullName;
          this.email = user.email;
          this.phone = user.phone;
          this.education = user.education;
          this.cnic = user.cnic;
          this.employmentStatus = user.employmentStatus;
          this.primarySkill = user.primarySkill;
          this.area = user.area;
          this.comment = user.comment;
        }
      })
    }
  }

  viewCriteria(){
    this.showDiv = true;
    // let candidateid = localStorage.getItem('candidateid');
    this.candidateService.getCriteriaForCandidate(this.candidateid).subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        return;
      }
      this.education = convertToString(data[0].education);
      this.gender = data[0].gender;
      for(let i=0; i<data.length; i++)
      {
        data[i].count = i+1;
      }
      this.totalCriteria = data;
      // console.log(this.totalCriteria);
    });
  }
}
