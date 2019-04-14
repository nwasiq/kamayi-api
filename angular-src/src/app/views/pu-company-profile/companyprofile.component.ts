import { Component } from '@angular/core';
import { CrudService } from '../../../services/crud/crud.service';
import { EmployerService } from '../../../services/employer/employer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: 'companyprofile.component.html'
})
export class CompanyprofileComponent {

  employerID: string;

  name: string;
  industry: string;
  phoneNo: string;
  website: string;

  city: string;

  pocName: string
  designation: string;
  email: string;
  mobileNo: string;
  address: string;
  pocCity: string;
  search: string;

  employerVacancies: any = [];

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private employerService: EmployerService
  ) { }

  zoom: number = 15;

  lat: number;
  lng: number;
  locationChosen = false;

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
      this.employerID = params['id']
    );
    // console.log(this.employerID);

    this.crudService.retrieveOne("employers",this.employerID).subscribe(data => {
      // console.log(data);
      if(data.message){
        alert(data.message);
        this.route.navigate(['/pu-assigned-employers/employers']);
      }
      else
      {
        this.name = data.companyName;
        this.industry = data.industry;
        this.phoneNo = data.companyPhone;
        this.website = data.website;
        this.city = data.location.city;
        this.lng = data.location.long;
        this.lat = data.location.lat;
        this.pocName = data.fullName
        this.designation = data.pocDesignation;
        this.email = data.email;
        this.mobileNo = data.pocPhone;
        this.address = data.pocAddress;
        this.pocCity = data.pocCity;
        this.employerService.getVacanciesForEmployer(this.employerID).subscribe(data2 => {
          this.employerVacancies = data2;
        })
      }
    })
  }

  viewVacancyDetails(vacancy)
  {
    // console.log(vacancy._id);
    this.route.navigate(['/pu-vacancy-detail/vacancydetails/' + vacancy._id]);
  }

  onSubmitCompanyProfile(){
    
  }

}