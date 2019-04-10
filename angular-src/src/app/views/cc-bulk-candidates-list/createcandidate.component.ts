import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { convertToNumber } from  '../../../services/convertEducation';
import { educationType } from '../../enums'
import { GetLatlong } from '../../../services/getCoords';

@Component({
  templateUrl: 'createcandidate.component.html'
})
export class CreatecandidateComponent {

  // cnicPattern=/^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/;

  candidateid: string;

  educationOf = ['Informal','Primary','Middle','Matric','O-Levels','Intermediate','A-Levels','Bachelors','Masters'];

  name: string;
  education: any;
  city: string;
  email: string;
  phone: string
  cnic: string;
  gender: string;
  age: string;
  employmentStatus: any;

  tiers: any = [];

  genderOf = ["Male", "Female"];
  employementOf = ["Employed", "Unemployed"];

  occupation: string;
  experience: number;
  employer: string;
  isTrained: boolean;
  coords: any;
  address: Object;
  formattedAddress: string;
  area: string;
  tempFunc: any;

  occupationList: any = [];

  comment: string;

  singleSelect: any = [];
  dropdownOptions: any = [];

  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  constructor(
    private crudService: CrudService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
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

  getPhone(place) {
    const COMPONENT_TEMPLATE = { formatted_phone_number: 'formatted_phone_number' },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }
  //end

  keyPress(event: any) {
    const pattern = /[0-9\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit(){

    this.crudService.retrieveAll('occupations').subscribe(data => {
      this.occupationList = data.occupations;
    });

    this.isTrained = false;

    this.activatedRoute.params.subscribe( params =>
      this.candidateid = params['id']
    );
    console.log(this.candidateid);

    if(this.candidateid){
      localStorage.removeItem('candidateid');
      this.crudService.retrieveOne("bulkcandidates", this.candidateid).subscribe(user => {
        if(user.message){
          alert(user.message);
          this.route.navigate(['/cc-bulk-candidates-list/bulkcandidates']);
        }
        else{
          this.name = user.fullName;
          this.email = user.email;
          this.phone = user.phone;
          this.education = user.education;
          this.cnic = user.cnic;
        }
      })
    }
  }

  appendCriteria(){
    if(!this.occupation || !this.employer)
    {
      alert("Please fill all criteria fields");
      return;
    }
    this.tiers.push({
      count: this.tiers.length + 1,
      occupation:  this.occupation,
      experience: this.experience,
      employer: this.employer,
      isTrained: this.isTrained
    });
    console.log(this.tiers);
  }

  deleteCriteria(row){
    this.tiers.splice(row.count-1, 1);
    for(let i=0; i<this.tiers.length; i++){
      this.tiers[i]['count'] = i+1; 
    }
  }

  zoom: number = 15;

  lat: number;
  lng: number;
  locationChosen = false;

  selectionChanged(val){
    // console.log(val.value.name);
    this.occupation = val.value.name;
  }

  onSubmitCreateCandidate(){
    if(this.tiers.length == 0){
      alert("No criteria added.");
      return;
    }
    let criteria: any = [];
    if (Object.keys(educationType).indexOf(this.education) == -1) {
      alert('Education not accepted'); //education not in required list of educations
      return;
    }

    if(this.cnic.length < 13)
    {
      alert("CNIC should be of length 13.");
      return;
    }

    let commentReq = false;
    let hasOtherSkill = false;
    for(let x of this.tiers){
      if(x.occupation == "Other")
      {
        hasOtherSkill = true;
        commentReq = true;
        break;
      }
    }
console.log(commentReq);
console.log(this.comment === "");
    if(commentReq && (this.comment === "" || this.comment === undefined ))
    {
      alert("Comment is required if 'Other' skill is entered.");
      return;
    }

    this.education = convertToNumber(this.education);
    for (let one of this.tiers){
      criteria.push({
        occupation:  one.occupation,
        experience: one.experience,
        employer: one.employer,
        isTrained: one.isTrained,
        gender: this.gender,
        location: {
          coordinates: [this.coords[0], this.coords[1]]
        },
        city: this.city,
        education: this.education
      })
    }

    //inline coding
    this.employmentStatus = this.employmentStatus == "Employed" ? true: false;
    
    const createCandidate = {
      primarySkill: this.tiers[0].occupation,
      fullName: this.name,
      cnic: this.cnic,
      phone: this.phone,
      age: this.age,
      area: this.address,
      employmentStatus: this.employmentStatus,
      email: this.email,
      criteria: criteria,
      hasOtherSkill: hasOtherSkill,
      comment: this.comment
    }
    console.log(createCandidate);
    this.crudService.create(createCandidate, "candidates").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        alert("Candidate Created!");
        this.route.navigate(['/cc-candidates-list/candidate']);
      }
    });
  }
}

