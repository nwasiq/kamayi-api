import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';

@Component({
  templateUrl: 'bulkcandidates.component.html'
})
export class BulkcandidatesComponent {

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
    private bulkCandidateService: BulkCandidateService
  ) { }

  ngOnInit(){
    this.bulkCandidateService.getBulkCandiesByStatus('false').subscribe(data => {
      console.log(data);
      if(data.message)
      {
        alert(data.message);
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
