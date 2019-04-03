import { Component } from '@angular/core';

@Component({
  templateUrl: 'companyprofile.component.html'
})
export class CompanyprofileComponent {

  name: string;
  industry: string;
  phoneNo: string;
  website: string;

  primaryLocation: string;

  pocName: string
  designation: string;
  email: string;
  mobileNo: string;
  address: string;
  city: string;

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

  onSubmitCompanyProfile(){
    const employersData = {
      name: this.name,
      industry: this.industry,
      phoneNo: this.phoneNo,
      website: this.website,
      pocName: this.pocName,
      designation: this.designation,
      email: this.email,
      mobileNo: this.mobileNo,
      address: this.address,
      city: this.city,
      location: this.markers,
      primaryLocation: this.primaryLocation

    }
    console.log(employersData);
  }
}

interface marker {
	lat: number;
	lng: number;
}