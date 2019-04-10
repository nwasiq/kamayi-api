import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {UserService } from '../../../services/user/user.service';
import {CrudService } from '../../../services/crud/crud.service';
import {EmployerService } from '../../../services/employer/employer.service';

@Component({
  templateUrl: 'assignment.component.html'
})
export class AssignmentComponent {

  public successModal;
  search: any;
  assignedOfficer: string;

  employersInfo: any = [];
  placementUsers: any = [];

  modalEmployerId: any;

  singleSelect: any = [];
  dropdownOptions: any = [];

  officerid: string;
  assignedCompany: string;
  openVacancy: string;

  config = {
    displayKey: "fullName", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  constructor(
    private userService: UserService,
    private employerService: EmployerService,
    private crudService: CrudService
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("employers").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.employersInfo = data.employers;
        console.log(this.employersInfo);
      }
    });
  }

  onAssignPO(){
    const assignPO = {
      placementOfficer: this.officerid
    }
    console.log(assignPO);
    this.crudService.update(assignPO, "employers", this.modalEmployerId).subscribe(data => {
      if(!data.message){
        alert("Successfully assigned.");
        window.location.reload();
      }
    })
  }

  displayPlacementUser(employer)
  {
    this.modalEmployerId = employer._id;
    this.userService.getPlacementUsers().subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.placementUsers = data;

        if(employer.placementOfficer){
        /**
         * if placement user already there for employer, pre select placement user name from placement
         * user list (like done in occupations) and show his dashboard stats
         */
        }
      }
    });  
  }

  selectionChanged(val){
    console.log(val);
    this.userService.getDashboardDetailsById(val.value._id).subscribe(data => {
      console.log(data);
      this.officerid = val.value._id;
      this.assignedCompany = data.assignedEmployers;
      this.openVacancy = data.openVacancies;
    })
    // this.occupation = val.value.name;
  }
}
