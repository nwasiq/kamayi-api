import { Component, NgZone } from '@angular/core';
import { GetLatlong } from '../../../services/getCoords';
import { CrudService } from '../../../services/crud/crud.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { convertToNumber } from  '../../../services/convertEducation';
import { EmployerService } from '../../../services/employer/employer.service';

@Component({
  templateUrl: 'newvacancy.component.html'
})
export class NewvacancyComponent {

  genderOf = ["Male", "Female", "Any"];
  typeOf = ["fullTime", "partTime"];
  educationOf = ['Informal','Primary','Middle','Matric','O-Levels','Intermediate','A-Levels','Bachelors','Masters'];
  education: any;

  placementUserID: string;

  title: string;
  description: string;
  occupation: string;
  assignedEmployers: any = [];

  primaryLocation: string;

  salary: number
  designation: string;
  requiredEducation: string;
  mobileNo: string;
  ageRange: string;
  
  type: string;
  totalSlots: number;
  minExp: number;
  genderReq: string;
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
  vacancyEmployerId: any;
  selectedOccupation: any;

  occupationList: any = [];

  config1 = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  config2 = {
    displayKey: "companyName", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  constructor(
    public zone: NgZone,
    private userService: UserService,
    private crudService: CrudService,
    private route: Router,
    private employerService: EmployerService
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

    this.crudService.retrieveAll('occupations').subscribe(data => {
      this.occupationList = data.occupations;
    });

    this.placementUserID = JSON.parse(localStorage.getItem('user'))._id;
    let userid = this.placementUserID;

    this.userService.getEmployersForPlacementUser(userid).subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        if(data.employers.length == 0)
        {
          alert("No employers assigned to you");
          this.route.navigate(['/pudashboard']);
        }
        this.assignedEmployers = data.employers;
      }
    });

  }

  employerSelectionChanged(val){
    this.vacancyEmployerId = val.value._id;
    this.mobileNo = val.value.pocPhone;
    // console.log(this.vacancyEmployerId);
  }

  occupationSelectionChanged(val){
    this.selectedOccupation = val.value.name;
    // console.log(this.selectedOccupation);
  }

  onSubmitCreateVacancy(){
    this.education = convertToNumber(this.requiredEducation);
    const vacancyData = {
      title: this.title,
      occupation: this.selectedOccupation,
      description: this.description,
      city: this.city,
      area: this.address,
      location: {
        coordinates: [this.coords[0], this.coords[1]]
      },
      salary: this.salary,
      openings: this.totalSlots,
      totalSlots: this.totalSlots,
      jobType: this.type,
      experience: this.minExp,
      educationRequirement: this.education,
      gender: this.genderReq,
      benefits: {
        insurance: this.insurance,
        transportation: this.transport,
        accomodation: this.accomodation,
        food: this.food,
        socialSecurity: this.socailSecurity
      },
      employer: this.vacancyEmployerId,
      pocNumber: this.mobileNo,
      designation: this.designation
    }
    // console.log(vacancyData);
    this.employerService.createVacancyForEmployer(this.vacancyEmployerId, vacancyData).subscribe(data => {
      // console.log(data);
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        alert("Vacancy Created!");
        this.route.navigate(['/pu-open-vacancy/openvacancy']);
      }
    })
  }
}