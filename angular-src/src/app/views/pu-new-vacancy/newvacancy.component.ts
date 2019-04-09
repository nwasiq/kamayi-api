import { Component } from '@angular/core';

@Component({
  templateUrl: 'newvacancy.component.html'
})
export class NewvacancyComponent {

  name: string;
  description: string;
  skillsetType: string;
  company: string;

  primaryLocation: string;

  salary: string
  designation: string;
  requiredEducation: string;
  mobileNo: string;
  ageRange: string;
  city: string;
  occupation: string;
  employer: string;
  type: string;
  totalSlots: string;
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

  onSubmitCreateVacancy(){
    const vacancyData = {
      name: this.name,
      description: this.description,
      skillsetType: this.skillsetType,
      company: this.company,
      salary: this.salary,
      designation: this.designation,
      requiredEducation: this.requiredEducation,
      mobileNo: this.mobileNo,
      ageRange: this.ageRange,
      city: this.city,
      primaryLocation: this.primaryLocation
    }
    console.log(vacancyData);
  }
}

interface marker {
	lat: number;
	lng: number;
}