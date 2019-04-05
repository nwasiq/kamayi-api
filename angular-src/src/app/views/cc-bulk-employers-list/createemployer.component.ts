import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { convertToNumber } from  '../../../services/convertEducation';
import { educationType } from '../../enums'
import { GetLatlong } from '../../../services/getCoords';

@Component({
  templateUrl: 'createemployer.component.html'
})
export class CreateemployerComponent {

  name: string;
  industry: any;
  phoneNo: string;
  website: string;

  coords: any;
  address: Object;
  formattedAddress: string;
  area: string;
  tempFunc: any;
  city: string;

  pocName: string;
  designation: string;
  email: string;
  mobileNo: string;
  pocAddress: string;
  pocCity: string;

  constructor(
    private crudService: CrudService,
    private route: Router,
    private bulkCandidateService: BulkCandidateService,
    public zone: NgZone
  ) { }

  // autocomplete address
  async getAddress(place: object) {
    this.address = place['formatted_address'];
    this.formattedAddress = place['formatted_address'];
    this.coords = await GetLatlong(this.address);
    this.lat = this.coords[1];
    this.lng = this.coords[0];
    this.city = this.getCity(place);
    this.zone.run(() => this.formattedAddress = place['formatted_address']);
  }

  getAddrComponent(place, componentTemplate) {
    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getCountryShort(place) {
    const COMPONENT_TEMPLATE = { country: 'short_name' },
      countryShort = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return countryShort;
  }

  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }
  //end
  

  ngOnInit(){

    let employerid = localStorage.getItem('employerid');
    console.log(employerid);
    if(employerid){
      localStorage.removeItem('empolyerid');
      this.crudService.retrieveOne("bulkemployers", employerid).subscribe(user => {
        if(user.message){
          alert(user.message);
          this.route.navigate(['/cc-bulk-employers-list/bulkemployers']);
        }
        else{
          this.name = user.fullName;
          this.industry = user.industry;
          this.phoneNo = user.phoneNo;
          this.website = user.website;
        }
      })
    }
  }

  zoom: number = 15;

  lat: number;
  lng: number;
  locationChosen = false;


  onSubmitCreateEmployer(){

    const createEmployer = {
      companyName: this.name,
      industry: this.industry,
      companyPhone: this.phoneNo,
      website: this.website,
      location: {
        lat: this.coords[1],
        long: this.coords[0],
        city: this.city,
      },
      fullName: this.pocName,
      pocDesignation: this.designation,
      email: this.email,
      pocPhone: this.mobileNo,
      pocAddress: this.pocAddress,
      pocCity: this.pocCity
    }
    console.log(createEmployer);
    this.crudService.create(createEmployer, "employers").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        alert("Employer Created!");
        this.route.navigate(['/cc-employers-list/employers']);
      }
    });
  }
}
