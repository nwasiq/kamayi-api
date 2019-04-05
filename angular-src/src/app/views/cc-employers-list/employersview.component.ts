import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { CandidateService } from '../../../services/candidate/candidate.service';
@Component({
  templateUrl: 'employersview.component.html'
})
export class EmployersviewComponent {

  companyName: string;
  industry: string;
  companyPhone: string;
  website: string;

  fullName: string;
  pocDesignation: string;
  email: string;
  pocPhone: string;
  pocAddress: string;
  pocCity: string;

  constructor(
    private crudService: CrudService,
    private route: Router,
    private candidateService: CandidateService
  ) { }

  ngOnInit(){

    let employerid = localStorage.getItem('employerid');
    console.log(employerid);

    if(employerid){
      this.crudService.retrieveOne("employers", employerid).subscribe(user => {
        if(user.message){
          alert(user.message);
          this.route.navigate(['/cc-employers-list/employers']);
        }
        else{
          this.companyName = user.companyName;
          this.industry = user.industry;
          this.companyPhone = user.companyPhone;
          this.website = user.website;
          this.fullName = user.fullName;
          this.pocDesignation = user.pocDesignation;
          this.email = user.email;
          this.pocPhone = user.pocPhone;
          this.pocAddress = user.pocAddress;
          this.pocCity = user.pocCity;
        }
      })
    }
  }

}
