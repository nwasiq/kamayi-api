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
  officerName: string;

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

    this.userService.getPlacementUsers().subscribe(data => {
      if (data.message) {
        alert(data.message);
      }
      else {
        this.placementUsers = data;
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
    this.officerid = "";
    this.assignedCompany = "";
    this.openVacancy = "";
    if (!employer.placementOfficer){
      this.officerName = null;
    }
    else{
      this.officerid = employer.placementOfficer;
      for (let officer of this.placementUsers) {
        if (officer._id == employer.placementOfficer) {
          console.log("Here");
          this.officerName = officer.fullName;
          break;
        }
      }
      this.userService.getDashboardDetailsById(this.officerid).subscribe(data => {
        this.assignedCompany = data.assignedEmployers;
        this.openVacancy = data.openVacancies;
      })
    }

      /**
       * Populate assigned employers and open vacancies
       */
    this.modalEmployerId = employer._id; 
  }

  selectionChanged(val){
    console.log(val);
    this.userService.getDashboardDetailsById(val.value._id).subscribe(data => {
      console.log(data);
      this.officerName = val.value.fullName;
      this.officerid = val.value._id;
      this.assignedCompany = data.assignedEmployers;
      this.openVacancy = data.openVacancies;
    })
    // this.occupation = val.value.name;
  }
}
