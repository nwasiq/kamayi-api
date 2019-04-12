import { Component } from '@angular/core';
import { CrudService } from '../../../services/crud/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToString } from  '../../../services/convertEducation';

@Component({
  templateUrl: 'vacancydetails.component.html'
})
export class VacancydetailsComponent {

  vacancyId: string;

  title: string;
  occupation: string;
  company: string;
  description: string;
  employer: string;

  area: string;
  zoom: number = 15;

  lat: number;
  lng: number;
  locationChosen = false;

  salary: string
  designation: string;
  
  requiredEducation: string;
  pocNumber: string;
  hired: string;
  openings: string;
  minExp: string;
  city: string;
  genderReq: string;
  comments: string;

  accomodation: string;
  transport: string;
  insurance: string;
  food: string;
  socialSecurity: string;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService
  ) { }

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
      this.vacancyId = params['id']
    );
    // console.log(this.vacancyId);

    this.crudService.retrieveOne("vacancys",this.vacancyId).subscribe(data => {
      // console.log(data);
      if(data.message){
        alert(data.message);
        this.route.navigate(['/pu-open-vacancy/openvacancy']);
      }
      else
      {
        this.crudService.retrieveOne("employers", data.employer).subscribe(data2 => {
          this.title = data.title;
          this.description = data.description;
          this.occupation = data.occupation;
          this.employer = data2.companyName;
          this.area = data.area;
          this.lng = data.location.coordinates[0];
          this.lat = data.location.coordinates[1];
          this.salary = data.salary;
          this.designation = data.designation;
          this.requiredEducation = convertToString(data.educationRequirement);
          this.pocNumber = data.pocNumber;
          this.minExp = data.experience;
          this.city = data.city;
          this.insurance = data.benefits.insurance;
          this.transport = data.benefits.transportation;
          this.accomodation = data.benefits.accomodation;
          this.food = data.benefits.food;
          this.socialSecurity = data.benefits.socialSecurity;
          this.hired = data.hired;
          this.openings = data.openings;
        })
      }
    })
  }

}