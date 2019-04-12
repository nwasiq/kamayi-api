import { Component } from '@angular/core';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { convertToString } from  '../../../services/convertEducation';

@Component({
  templateUrl: 'managecriteria.component.html'
})
export class ManagecriteriaComponent {

  vacancyId: any;
  hired: number;
  openings: number;
  occupation: string;
  employer: string;

  gender: boolean;
  education: boolean;
  experience: boolean;
  city: boolean;
  location: boolean;
  unemployed: boolean;
  educationWeight: number;
  experienceWeight: number;
  locationWeight: number;
  generateWeighted: boolean;

  sort: any;

  candidatesInfo: any = [];

  candidateID: string;
  candidateName: string;
  candidateGender: string;
  candidateOccupation: string;
  candidateCity: string;
  candidateEducation: string;
  candidateExp: string;
  
  shortListCandidatesIds: any = [];

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private vacancyService: VacancyService,
    private crudService: CrudService
  ) { }

  sortBy = ["education", "experience", "location", "none"];

  checkAll(ev) {
    this.candidatesInfo.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    return this.candidatesInfo.every(_ => _.state);
  }

  ngOnInit(){
    this.gender = false;
    this.education = false;
    this.experience = false;
    this.city = false;
    this.location = false;
    this.unemployed = false;
    this.generateWeighted = false;

    this.activatedRoute.params.subscribe( params =>
      this.vacancyId = params['id']
    );

    this.crudService.retrieveOne("vacancys",this.vacancyId).subscribe(data => {
      if(data.message){
        alert(data.message);
        this.route.navigate(['/pu-open-vacancy/openvacancy']);
      }
      else
      {
        this.crudService.retrieveOne("employers", data.employer).subscribe(data2 => {
          this.occupation = data.occupation;
          this.employer = data2.companyName;
          this.hired = data.hired;
          this.openings = data.openings;
        })
      }
    })
  }

  generateList(){
    let isSort = false;
    let paramCount = 0;
    let educationUri = "";
    let experienceUri = "";
    let locationUri = "";
    let uri = "";

    if(this.sort != undefined && this.sort != "none")
    {
      isSort = true;
      this.generateWeighted = false;
    }

    if(this.gender || this.education || this.experience || 
      this.city || this.location || this.unemployed || 
      this.generateWeighted || isSort){
        uri = "?";
    }

    if(isSort){
      if(paramCount > 0){
        uri += "&";
      }
      uri += "sort="+this.sort;
      paramCount++;
    }

    if(this.gender)
    {
      if(paramCount > 0){
        uri += "&";
      }
      uri += "gender";
      paramCount++;
    }
   
    if(this.city)
    {
      if(paramCount > 0){
        uri += "&";
      }
      uri += "city";
      paramCount++;
    }
   
    if(this.unemployed)
    {
      if(paramCount > 0){
        uri += "&";
      }
      uri += "employmentStatus="+false;
      paramCount++;
    }

    if(this.generateWeighted)
    {
      if(paramCount > 0){
        uri += "&";
      }
      uri += "weighted";

      if((this.educationWeight == null || this.educationWeight == undefined)
        && (this.experienceWeight == null || this.experienceWeight == undefined)
        && (this.locationWeight == null || this.locationWeight == undefined))
        {
          alert("No weights selected.");
          return;
        }
        if(this.education)
        {
          if(paramCount > 0){
            uri += "&";
          }

          if(this.educationWeight != null && this.educationWeight != undefined)
          {
            educationUri = "education="+this.educationWeight;
          }
          else
          {
            educationUri = "education";
          }
          uri += educationUri;
          paramCount++;
        }

        if(this.experience)
        {
          if(paramCount > 0){
            uri += "&";
          }
          if(this.experienceWeight != null && this.experienceWeight != undefined)
          {
            experienceUri = "experience="+this.experienceWeight;
          }
          else
          {
            experienceUri = "experience";
          }
          uri += experienceUri;
          paramCount++;
        }

        if(this.location)
        {
          if(paramCount > 0){
            uri += "&";
          }
          if(this.locationWeight != null && this.locationWeight != undefined)
          {
            locationUri = "location="+this.locationWeight;
          }
          else
          {
            locationUri = "location";
          }
          uri += locationUri;
          paramCount++;
        }
    }
    else
    {
      if(this.education)
      {
        if(paramCount > 0){
          uri += "&";
        }
        uri += "education";
        paramCount++;
      }

      if(this.experience)
      {
        if(paramCount > 0){
          uri += "&";
        }
        uri += "experience";
        paramCount++;
      }

      if(this.location)
      {
        if(paramCount > 0){
          uri += "&";
        }
        uri += "location";
        paramCount++;
      }
    }
    this.vacancyService.getTentativeShortList(this.vacancyId, uri).subscribe(data => {
      if(data.candidates.length == 0){
        alert("No candidates matched your criteria.");
        return;
      }
      console.log(data);
      this.candidatesInfo = data.candidates;
      // console.log(this.candidatesInfo);
    });
  }

  viewShortList(){
    this.route.navigate(['/pu-vacancy-detail/manageshortlist/' + this.vacancyId]);
    localStorage.setItem('occupation', this.occupation);
  }

  createShortList(){
    if(this.candidatesInfo.length == 0)
    {
      alert("No candidates to shortlist.");
      return;
    }
    
    for(let x of this.candidatesInfo){
      if(x.state)
      {
        this.shortListCandidatesIds.push(x.candidate._id);
      }
    }

    if(this.shortListCandidatesIds.length == 0)
    {
      alert("No candidate selected.");
      return;
    }
    
    let candidateIDsObject = {
      candidateIds: this.shortListCandidatesIds
    }
    this.vacancyService.createShortList(candidateIDsObject, this.vacancyId).subscribe(data => {
      console.log(candidateIDsObject);
      console.log(data);
      if(data.message){
        alert(data.message);
      }
      else
      {
        alert("Shortlist created successfully.");
        this.route.navigate(['/pu-vacancy-detail/manageshortlist/' + this.vacancyId]);
        localStorage.setItem('occupation', this.occupation);
      }
    })
  }

}
