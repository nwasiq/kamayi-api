import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { convertToNumber } from  '../../../services/convertEducation';
import { educationType } from '../../enums'

@Component({
  templateUrl: 'createcandidate.component.html'
})
export class CreatecandidateComponent {

  name: string;
  education: any;
  city: string;
  email: string;
  phone: string
  cnic: string;
  gender: string;
  age: string;
  employmentStatus: boolean;

  tiers: any = [];

  genderOf = ["Male", "Female"];

  occupation: string;
  experience: string;
  employer: string;
  isTrained: boolean;

  constructor(
    private crudService: CrudService,
    private route: Router,
    private bulkCandidateService: BulkCandidateService
  ) { }

  ngOnInit(){
    // this.tiers.push({
    //   count: 1,
    //   occupation:  "",
    //   experience: "",
    //   employer: "",
    //   isTrained: ""
    // });

    this.isTrained = false;

    let candidateid = localStorage.getItem('candidateid');
    console.log(candidateid);
    if(candidateid){
      localStorage.removeItem('candidateid');
      this.crudService.retrieveOne("bulkcandidates", candidateid).subscribe(user => {
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
    if(!this.occupation || !this.experience || !this.employer)
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

  onSubmitCreateCandidate(){
    let criteria: any = [];
    if (Object.keys(educationType).indexOf(this.education) == -1) {
      alert('Education not accepted'); //education not in required list of educations
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
          coordinates: [this.markers[0].lng, this.markers[0].lat]
        },
        education: this.education
      })
    }
    const createCandidate = {
      primarySkill: this.tiers[0].occupation,
      fullName: this.name,
      cnic: this.cnic,
      phone: this.phone,
      age: this.age,
      employmentStatus: this.employmentStatus,
      email: this.email,
      criteria: criteria
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

interface marker {
	lat: number;
	lng: number;
}
