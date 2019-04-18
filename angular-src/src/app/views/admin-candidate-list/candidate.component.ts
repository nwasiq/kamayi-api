import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { PagerService } from '../../../services/pager.service';
import { CandidateService } from '../../../services/candidate/candidate.service';

@Component({
  templateUrl: 'candidate.component.html'
})
export class CandidateComponent {

  busy: Subscription;

  // pager object
  pager: any = {};
  pager2: any = {};
  pager3: any = {};

  // paged items
  pagedItems: any[];
  pagedItems2: any[];
  pagedItems3: any[];

  candidatesInfo: any;
  otherSkillInfo: any;
  searchInfo: any;

  search:any;

  fullName: string;
  primarySkill: string;
  phoneNo: string;
  cnic: string;
  otherSkill: string;

  otherSkillArr = ["true", "false"];

  constructor(
    private crudService: CrudService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService,
    private pagerService: PagerService,
    private candidateService: CandidateService
  ) { }

  ngOnInit(){
    this.busy = this.crudService.retrieveAll("candidates").subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        this.candidatesInfo = data.candidates;
        this.setPageAll(1);
        // console.log(this.candidatesInfo);
      }
    });

    let filterObj = {
      query: {
        hasOtherSkill: true
      }
    }

    this.busy = this.candidateService.filterCandidates(filterObj).subscribe(data2 => {
        this.otherSkillInfo = data2.candidates;
        this.setPageOtherSkill(1);
    }); 
  }

  setPageAll(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.candidatesInfo.length, page);

    // get current page of items
    this.pagedItems = this.candidatesInfo.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  setPageOtherSkill(page: number) {
    // get pager object from service
    this.pager2 = this.pagerService.getPager(this.otherSkillInfo.length, page);

    // get current page of items
    this.pagedItems2 = this.otherSkillInfo.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
  }

  setPageSearch(page: number) {
    // get pager object from service
    this.pager3 = this.pagerService.getPager(this.searchInfo.length, page);

    // get current page of items
    this.pagedItems3 = this.searchInfo.slice(this.pager3.startIndex, this.pager3.endIndex + 1);
  }

  onViewCandidate(candidate){
    // localStorage.setItem("candidateid", candidate._id);
    this.route.navigate(['/admin-candidate-list/candidateview/' + candidate._id]);
  }

  filterCandidates(){
    let queryObj = {
      query: {
        fullName: "",
        primarySkill: "",
        phone: "",
        cnic: "",
        hasOtherSkill: ""
      }
    }

    if(this.fullName && this.fullName != ""){
      queryObj.query.fullName = this.fullName;
    }
    else
    {
      delete queryObj.query.fullName;
    }
    if(this.primarySkill && this.primarySkill != ""){
      queryObj.query.primarySkill = this.primarySkill;
    }
    else
    {
      delete queryObj.query.primarySkill;
    }
    if(this.phoneNo && this.phoneNo != ""){
      queryObj.query.phone = this.phoneNo;
    }
    else
    {
      delete queryObj.query.phone;
    }
    if(this.cnic && this.cnic != ""){
      queryObj.query.cnic = this.cnic;
    }
    else
    {
      delete queryObj.query.cnic;
    }
    if(this.otherSkill){
      queryObj.query.hasOtherSkill = this.otherSkill;
    }
    else
    {
      delete queryObj.query.hasOtherSkill;
    }

    this.busy = this.candidateService.filterCandidates(queryObj).subscribe(data => {
      if(data.message){
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        return;
      }
      this.searchInfo = data;
      this.setPageSearch(1);
  }); 
  }

}
