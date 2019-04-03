import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';

@Component({
  templateUrl: 'createcandidate.component.html'
})
export class CreatecandidateComponent {

  name: string;
  education: string;
  city: string;
  email: string;
  phone: string
  cnic: string;
  gender: string;
  age: string;
  employmentStatus: boolean;

  tiers: any = [];

  genderOf = ["Male", "Female"];

  constructor(
    private crudService: CrudService,
    private route: Router,
    private bulkCandidateService: BulkCandidateService
  ) { }

  ngOnInit(){
    this.tiers.push({
      count: 1,
      occupation:  "",
      experience: "",
      employer: "",
      isTrained: ""
    });

    let candidateid = localStorage.getItem('candidateid');
    console.log(candidateid);
    if(candidateid){
      localStorage.removeItem('candidateid');
      this.crudService.retrieveOne("bulkcandidates", candidateid).subscribe(user => {
        if(user.message){
          alert(user.message);
          this.route.navigate(['/admin-user-list/user']);
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

  addTier(){
    this.tiers.push({
      count: this.tiers.length + 1,
      occupation:  "",
      experience: "",
      employer: "",
      isTrained: ""
    });
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
