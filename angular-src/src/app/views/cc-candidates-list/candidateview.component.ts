import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';

@Component({
  templateUrl: 'candidateview.component.html'
})
export class CandidateviewComponent {

  name: string;
  email: string;
  phone: string;
  education: string;
  cnic: string;
  employmentStatus: boolean;
  primarySkill: string;

  constructor(
    private crudService: CrudService,
    private route: Router,
    private bulkCandidateService: BulkCandidateService
  ) { }

  ngOnInit(){

    let candidateid = localStorage.getItem('candidateid');
    console.log(candidateid);

    if(candidateid){
      this.crudService.retrieveOne("candidates", candidateid).subscribe(user => {
        if(user.message){
          alert(user.message);
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
        }
      })
    }
  }

  viewCriteria(){
    
  }
}
