import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { PagerService } from '../../../services/pager.service';

@Component({
  templateUrl: 'candidate.component.html'
})
export class CandidateComponent {

  busy: Subscription;

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  candidatesInfo: any;
  search:any;
  constructor(
    private crudService: CrudService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService,
    private pagerService: PagerService
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
        this.setPage(1);
        // console.log(this.candidatesInfo);
      }
    });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.candidatesInfo.length, page);

    // get current page of items
    this.pagedItems = this.candidatesInfo.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  onViewCandidate(candidate){
    // localStorage.setItem("candidateid", candidate._id);
    this.route.navigate(['/admin-candidate-list/candidateview/' + candidate._id]);
  }

}
