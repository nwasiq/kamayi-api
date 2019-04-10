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
  officerID: number;
  assignedCompanies: number;
  openVacancies: number;

  employersInfo: any = [];
  placementUsers: any = [];

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
      assignOfficer: this.assignedOfficer,
      officerID: this.officerID,
      assignedCompanies: this.assignedCompanies,
      openVacancies: this.openVacancies
    }
    console.log(assignPO);
  }

  displayPlacementUser()
  {
    this.userService.getPlacementUsers().subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.placementUsers = data;
        console.log(this.placementUsers);
      }
    });
  }

}
