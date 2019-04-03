import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';

@Component({
  templateUrl: 'candidate.component.html'
})
export class CandidateComponent {

  candidatesInfo: any;

  constructor(
    private crudService: CrudService,
    private route: Router,
    private bulkCandidateService: BulkCandidateService
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("candidates").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.candidatesInfo = data.candidates;
        console.log(this.candidatesInfo);
      }
    });
  }

}