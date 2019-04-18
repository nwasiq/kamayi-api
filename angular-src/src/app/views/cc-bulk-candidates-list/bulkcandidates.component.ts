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

  candidatesInfo: any;

  pager: any = {};
  pagedItems: any[];

  constructor(
    private crudService: CrudService,
    private router: Router,
    private bulkCandidateService: BulkCandidateService,
    private _flashMessagesService: FlashMessagesService,
    private pagerService: PagerService
  ) { }

  ngOnInit(){
    this.busy = this.bulkCandidateService.getBulkCandiesByStatus('false').subscribe(data => {
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
}
