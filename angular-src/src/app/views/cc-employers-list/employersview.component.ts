import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { CandidateService } from '../../../services/candidate/candidate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'employersview.component.html'
})
export class EmployersviewComponent {

  busy: Subscription;

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
    private candidateService: CandidateService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
      this.employerid = params['id']
      );
      // console.log(this.employerid);

    if(this.employerid){
      this.busy = this.crudService.retrieveOne("employers", this.employerid).subscribe(user => {
        if(user.message){
          // alert(user.message);
          this._flashMessagesService.show(user.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
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

  updateEmployer(){
    
    let updateObj = {
      companyName:this.companyName,
      industry: this.industry,
      companyPhone: this.companyPhone,
      website: this.website,
      fullName: this.fullName,
      pocDesignation: this.pocDesignation,
      email: this.email,
      pocPhone: this.pocPhone,
      pocAddress: this.pocAddress,
      pocCity: this.pocCity,
    }

    this.busy = this.crudService.update(updateObj, 'employers', this.employerid).subscribe(data => {

      this._flashMessagesService.show("Employer Updated", { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function () {
        location.reload();
      }, 1000);
    })
  }

}
