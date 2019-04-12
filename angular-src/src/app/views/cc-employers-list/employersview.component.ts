import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { CandidateService } from '../../../services/candidate/candidate.service';
@Component({
  templateUrl: 'employersview.component.html'
})
export class EmployersviewComponent {

  employerid: string;

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
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService
  ) { }

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
      this.employerid = params['id']
      );
      // console.log(this.employerid);

    if(this.employerid){
      this.crudService.retrieveOne("employers", this.employerid).subscribe(user => {
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
