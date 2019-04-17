import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

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

  constructor(
    private crudService: CrudService,
    private router: Router,
    private bulkCandidateService: BulkCandidateService,
    private _flashMessagesService: FlashMessagesService
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
      }
    });
  }
  
  onViewCandidate(candidate){

    // localStorage.setItem("candidateid", candidate._id);
    this.router.navigate(['/cc-bulk-candidates-list/createcandidate/' + candidate._id]);
  }
}
