import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { PagerService } from '../../../services/pager.service';

@Component({
  templateUrl: 'bulkcandidates.component.html'
})
export class BulkcandidatesComponent {

  busy: Subscription;

  fullName: string;
  cnic: string;
  phone: string;
  dob: string;
  education: string; 
  training: string; 
  experience: number; 
  city: string; 
  email: string;
  primarySkill: string;
  search: any;
  fileToUpload: File;
  phoneNo: string;
  updatedCallStatus: string;
  callStatus: string;
  callStatusArr = ['Select Status', 'Not Called', 'Not Answered', 'Wrong Number', 'Call Back', 'Not Interested', 'Switched Off'];

  candidatesInfo: any;
  searchInfo: any;

  pager: any = {};
  pagedItems: any[];

  pager2: any = {};
  pagedItems2: any[];

  candidateId: string;

  constructor(
    private crudService: CrudService,
    private router: Router,
    private bulkCandidateService: BulkCandidateService,
    private _flashMessagesService: FlashMessagesService,
    private pagerService: PagerService
  ) { }

  ngOnInit(){
    this.callStatus = 'Select Status'
    /**
     * @todo: if status of bulk candidate is true (which means he is a candidate now)
     * give indication and make him uneditable
     */
    this.busy = this.bulkCandidateService.getAllBulkCandies().subscribe(data => {
      // console.log(data);
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        this.candidatesInfo = data.bulkcandidates;
        this.setPage(1);
      }
    });
  }
  
  onViewCandidate(candidate){

    // localStorage.setItem("candidateid", candidate._id);
    this.router.navigate(['/cc-bulk-candidates-list/createcandidate/' + candidate._id]);
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.candidatesInfo.length, page);

    // get current page of items
    this.pagedItems = this.candidatesInfo.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  setPageSearch(page: number) {
    // get pager object from service
    this.pager2 = this.pagerService.getPager(this.searchInfo.length, page);

    // get current page of items
    this.pagedItems2 = this.searchInfo.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
  }

  filterCandidates() {
    let queryObj = {
      query: {
        fullName: "",
        phone: "",
        cnic: "",
        callStatus: ""
      }
    }

    if (this.fullName && this.fullName != "") {
      queryObj.query.fullName = this.fullName;
    }
    else {
      delete queryObj.query.fullName;
    }
    if (this.phoneNo && this.phoneNo != "") {
      queryObj.query.phone = this.phoneNo;
    }
    else {
      delete queryObj.query.phone;
    }
    if (this.cnic && this.cnic != "") {
      queryObj.query.cnic = this.cnic;
    }
    else {
      delete queryObj.query.cnic;
    }
    if (this.callStatus && this.callStatus != "Select Status") {
      queryObj.query.callStatus = this.callStatus;
    }
    else {
      delete queryObj.query.callStatus;
    }

    this.busy = this.bulkCandidateService.filterCandidates(queryObj).subscribe(data => {
      if (data.message) {
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        return;
      }
      this.searchInfo = data;
      this.setPageSearch(1);
    });
  }

  getCurrentModalCandyId(candy){
    this.candidateId = candy._id;
  }

  updateCallStatus(){
    let updateObj = {
      callStatus: this.updatedCallStatus
    };

    this.busy = this.crudService.update(updateObj, "bulkcandidates", this.candidateId).subscribe(data => {
      this._flashMessagesService.show('Status updated successfully', { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);

      setTimeout(function () {
        location.reload();
      }, 1000);
    })
  }
}
