import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { CandidateService } from '../../../services/candidate/candidate.service';
import { convertToString } from '../../../services/convertEducation';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'candidateview.component.html'
})
export class CandidateviewComponent {

  busy: Subscription;

  candidateid: string;

  name: string;
  email: string;
  phone: string;
  cnic: string;
  employmentStatus: any;
  primarySkill: string;
  area: string;

  totalCriteria: any = [];
  
  showDiv: boolean = false;

  gender: string;
  education: string;

  comment: string;

  educationOf = ['Informal','Primary','Middle','Matric','O-Levels','Intermediate','A-Levels','Bachelors','Masters'];
  employementOf = ["Employed", "Unemployed"];

  occupationList: any = [];

  singleSelect: any = [];
  dropdownOptions: any = [];

  selectedOccupation: any;

  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  constructor(
    private crudService: CrudService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){

    this.busy = this.crudService.retrieveAll('occupations').subscribe(data => {
      this.occupationList = data.occupations;
    });

    this.activatedRoute.params.subscribe( params =>
        this.candidateid = params['id']
      );
    // console.log(this.candidateid);

    if(this.candidateid){
      this.busy = this.crudService.retrieveOne("candidates", this.candidateid).subscribe(user => {
        // console.log(user);
        if(user.message){
          // alert(user.message);
          this._flashMessagesService.show(user.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
          this.route.navigate(['/cc-candidates-list/candidate']);
        }
        else{
          this.name = user.fullName;
          this.email = user.email;
          this.phone = user.phone;
          this.education = user.education;
          this.cnic = user.cnic;
          this.employmentStatus = user.employmentStatus;
          this.primarySkill = user.primarySkill;
          this.area = user.area;
          this.comment = user.comment;
        }
      })
    }
  }

  viewCriteria(){
    this.showDiv = true;
    // let candidateid = localStorage.getItem('candidateid');
    this.candidateService.getCriteriaForCandidate(this.candidateid).subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        return;
      }
      this.education = convertToString(data[0].education);
      this.gender = data[0].gender;
      for(let i=0; i<data.length; i++)
      {
        data[i].count = i+1;
      }
      this.totalCriteria = data;
      console.log(this.totalCriteria);
    });
  }

  updateCandidate(){
    this.employmentStatus = this.employmentStatus == "Employed" ? true: false;

    const updateCandi = {
      fullName: this.name,
      cnic: this.cnic,
      phone: this.phone,
      employmentStatus: this.employmentStatus,
      email: this.email,
      comment: this.comment
    }
    if(this.name && this.name != ""){
      updateCandi.fullName = this.name
    }
    else{
      delete updateCandi.fullName
    }

    if(this.cnic && this.cnic != ""){
      updateCandi.cnic = this.cnic
    }
    else{
      delete updateCandi.cnic
    }

    if(this.phone && this.phone != ""){
      updateCandi.phone = this.phone
    }
    else{
      delete updateCandi.phone
    }

    if(this.employmentStatus){
      updateCandi.employmentStatus = this.employmentStatus
    }
    else{
      delete updateCandi.employmentStatus
    }

    if(this.email && this.email != ""){
      updateCandi.email = this.email
    }
    else{
      delete updateCandi.email
    }

    if(this.comment && this.comment != ""){
      updateCandi.comment = this.comment
    }
    else{
      delete updateCandi.comment
    }

    // console.log(updateCandi);
    this.busy = this.crudService.update(updateCandi, "candidates", this.candidateid).subscribe(data => {
      this._flashMessagesService.show("Updated Successfully.", { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function(){ 
        location.reload(); 
      }, 1000);
    });
  }

  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  selectionChanged(val, id){
    for(let x of this.totalCriteria)
    {
      if(x._id == id)
      {
        x.occupation = val.value.name;
        break;
      }
    }
    // console.log(val, id);
  }

  onSubmitUpdateCandidate(id){
    let updateObj = {
      occupation: "",
      employer: "",
      experience: 0
    };
    for(let x of this.totalCriteria)
    {
      if(x._id == id)
      {
        updateObj.occupation = x.occupation;
        updateObj.employer = x.employer;
        updateObj.experience = x.experience;
        break;
      }
    }
    
    // console.log(updateObj);
    this.busy = this.crudService.update(updateObj, "criterias", id).subscribe(data => {
      let otherCriteria = false;
      for(let x of this.totalCriteria){
        if(x.occupation == 'Other'){
          otherCriteria = true;
          break;
        }
      }
      if(!otherCriteria){
        let updateObj2 = {
          primarySkill: this.totalCriteria[0].occupation,
          hasOtherSkill: false
        }
        this.busy = this.crudService.update(updateObj2, "candidates", this.candidateid).subscribe(data2 => {
          // alert("Criteria updated!");
          this._flashMessagesService.show("Criteria updated!", { cssClass: 'alert-success text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
        })
      }
      else
      {
        // alert("Criteria updated!");
        this._flashMessagesService.show("Criteria updated!", { cssClass: 'alert-success text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
    })
  }
}
