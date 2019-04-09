import { Component, NgZone } from '@angular/core';
import { GetLatlong } from '../../../services/getCoords';

@Component({
  templateUrl: 'newvacancy.component.html'
})
export class NewvacancyComponent {

  name: string;
  description: string;
  occupation: string;
  employer: string;

  primaryLocation: string;

  salary: string
  designation: string;
  requiredEducation: string;
  mobileNo: string;
  ageRange: string;
  cityDetail: string;
  
  type: string;
  totalSlots: string;
  minExp: string;
  genderReq: string;
  comments: string;
  insurance: boolean;
  transport: boolean;
  accomodation: boolean;
  food: boolean;
  socailSecurity: boolean;

  coords: any;
  address: Object;
  formattedAddress: string;
  area: string;
  city: string;
  tempFunc: any;

  constructor(
    public zone: NgZone
  ) { }

  zoom: number = 15;

  lat: number;
  lng: number;
  locationChosen = false;

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

  getPhone(place) {
    const COMPONENT_TEMPLATE = { formatted_phone_number: 'formatted_phone_number' },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }
  //end
  ngOnInit(){
    this.insurance = false;
    this.transport = false;
    this.accomodation = false;
    this.food = false;
    this.socailSecurity = false;
  }

  onSubmitCreateVacancy(){
    const vacancyData = {
      name: this.name,
      description: this.description,
      occupation: this.occupation,
      employer: this.employer,
      location: {
        coordinates: [this.coords[0], this.coords[1]]
      },
      salary: this.salary,
      designation: this.designation,
      type: this.type,
      requiredEducation: this.requiredEducation,
      mobileNo: this.mobileNo,
      totalSlots: this.totalSlots,
      ageRange: this.ageRange,
      cityDetail: this.cityDetail,
      minExp: this.minExp,
      genderReq: this.genderReq,
      comments: this.comments,
      insurance: this.insurance,
      transport: this.transport,
      accomodation: this.accomodation,
      food: this.food,
      socailSecurity: this.socailSecurity
    }
    console.log(vacancyData);
  }
}

interface marker {
	lat: number;
	lng: number;
}