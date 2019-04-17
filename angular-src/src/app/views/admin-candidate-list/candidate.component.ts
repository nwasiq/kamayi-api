import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'candidate.component.html'
})
export class CandidateComponent {

  busy: Subscription;

  candidatesInfo: any;
  search:any;
  constructor(
    private crudService: CrudService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService
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
        // console.log(this.candidatesInfo);
      }
    });
  }

  onViewCandidate(candidate){
    // localStorage.setItem("candidateid", candidate._id);
    this.route.navigate(['/admin-candidate-list/candidateview/' + candidate._id]);
  }

}
