import { Component } from '@angular/core';

@Component({
  templateUrl: 'vacancydetails.component.html'
})
export class VacancydetailsComponent {

  name: string;
  description: string;
  occupation: string;
  employer: string;

  primaryLocation: string;

  salary: string
  designation: string;
  type: string;
  requiredEducation: string;
  mobileNo: string;
  totalSlots: string;
  ageRange: string;
  city: string;
  minExp: string;
  genderReq: string;
  comments: string;

  insurance: string;
  transport: string;
  accomodation: string;
  food: string;
  socailSecurity: string;

  constructor() { }

  markers: marker[] = []

  zoom: number = 15;

  lat: number = 33.6844;
  lng: number = 73.0479;
  locationChosen = false;

  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
    console.log(this.markers);
  }

  onSubmitVacancyDetails(){
    const employersData = {
      name: this.name,
      description: this.description,
      occupation: this.occupation,
      employer: this.employer,
      salary: this.salary,
      designation: this.designation,
      type: this.type,
      requiredEducation: this.requiredEducation,
      mobileNo: this.mobileNo,
      totalSlots: this.totalSlots,
      ageRange: this.ageRange,
      city: this.city,
      minExp: this.minExp,
      genderReq: this.genderReq,
      comments: this.comments,
      insurance: this.insurance,
      transport: this.transport,
      accomodation:this.accomodation,
      food: this.food,
      socailSecurity: this.socailSecurity,
      primaryLocation: this.primaryLocation

    }
    console.log(employersData);
  }
}

interface marker {
	lat: number;
	lng: number;
}