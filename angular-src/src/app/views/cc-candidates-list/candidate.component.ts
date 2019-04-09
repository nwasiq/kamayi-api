import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'candidate.component.html'
})
export class CandidateComponent {

  candidatesInfo: any;
  search: any;
  constructor(
    private crudService: CrudService,
    private route: Router
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

  onViewCandidate(candidate){
    localStorage.setItem("candidateid", candidate._id);
    this.route.navigate(['/cc-candidates-list/candidateview/' + candidate._id]);
  }

}
