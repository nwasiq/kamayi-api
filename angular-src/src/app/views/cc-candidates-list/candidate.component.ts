import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { PagerService } from '../../../services/pager.service';
import {Sort} from '@angular/material';

@Component({
  templateUrl: 'candidate.component.html'
})
export class CandidateComponent {

  busy: Subscription;
  pager: any = {};
  pagedItems: any[];

  sortedData: any[];

  candidatesInfo: any;
  search: any;
  constructor(
    private crudService: CrudService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService,
    private pagerService: PagerService,
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
        this.sortedData = this.pagedItems.slice();
        // console.log(this.candidatesInfo);
      }
    });
    
  }

  onViewCandidate(candidate){
    // localStorage.setItem("candidateid", candidate._id);
    this.route.navigate(['/cc-candidates-list/candidateview/' + candidate._id]);
  }


  setPageAll(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.candidatesInfo.length, page);

    // get current page of items
    this.pagedItems = this.candidatesInfo.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.sortedData = this.pagedItems;
  }

  sortData(sort: Sort) {
    const data = this.pagedItems.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case '_id': return compare(a._id, b._id, isAsc);
        case 'fullName': return compare(a.fullName, b.fullName, isAsc);
        case 'primarySkill': return compare(a.primarySkill, b.primarySkill, isAsc);
        case 'phone': return compare(a.phone, b.phone, isAsc);
        case 'cnic': return compare(a.cnic, b.cnic, isAsc);
        case 'area': return compare(a.area, b.area, isAsc);
        case 'hasOtherSkill': return compare(a.hasOtherSkill, b.hasOtherSkill, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
