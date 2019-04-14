import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { CandidateService } from '../../../services/candidate/candidate.service';
import { convertToString } from '../../../services/convertEducation';

@Component({
  templateUrl: 'candidateview.component.html'
})
export class CandidateviewComponent {

  occupationList: any = [];

  candidateid: string;

  name: string;
  email: string;
  phone: string;
  cnic: string;
  employmentStatus: boolean;
  primarySkill: string;
  area: string;

  totalCriteria: any = [];
  
  showDiv: boolean = false;

  gender: string;
  education: string;

  comment: string;

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
    private candidateService: CandidateService
  ) { }

  ngOnInit(){

    this.crudService.retrieveAll('occupations').subscribe(data => {
      this.occupationList = data.occupations;
    });

    this.activatedRoute.params.subscribe( params =>
        this.candidateid = params['id']
      );
    // console.log(this.candidateid);

    if(this.candidateid){
      this.crudService.retrieveOne("candidates", this.candidateid).subscribe(user => {
        if(user.message){
          alert(user.message);
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
    let candidateid = this.candidateid;
    this.candidateService.getCriteriaForCandidate(candidateid).subscribe(data => {
      if(data.message)
      {
        alert(data.message);
        return;
      }
      this.education = convertToString(data[0].education);
      this.gender = data[0].gender;
      for(let i=0; i<data.length; i++)
      {
        data[i].count = i+1;
      }
      this.totalCriteria = data;
      // console.log(this.totalCriteria);
    });
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
      occupation: ""
    };
    for(let x of this.totalCriteria)
    {
      if(x._id == id)
      {
        updateObj.occupation = x.occupation
        break;
      }
    }
    
    // console.log(updateObj);
    this.crudService.update(updateObj, "criterias", id).subscribe(data => {
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
        this.crudService.update(updateObj2, "candidates", this.candidateid).subscribe(data2 => {
          alert("Criteria updated!");
        })
      }
      else
      {
        alert("Criteria updated!");
      }
    })
  }
}
