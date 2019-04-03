import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'assignment.component.html'
})
export class AssignmentComponent {

  public successModal;

  assignedOfficer: string;
  officerID: number;
  assignedCompanies: number;
  openVacancies: number;

  constructor() { }

  employersInfo = [
    {id: '1', companyName: 'Honda Atlas', industry: 'Cars', location: 'Islamabad', contactNo: '03331234567', poc: 'Ahmad Ali', status: 'Unassigned'},
    {id: '2', companyName: 'Osaka Batteries', industry: 'Batteries', location: 'Lahore', contactNo: '03001234567', poc: 'Ilyas Muhammad', status: 'Unassigned'},
    {id: '3', companyName: 'Toyota GLI', industry: 'Cars', location: 'Peshawar', contactNo: '03451234567', poc: 'Anwar Ali', status: 'Assigned'}
  ];

  pOfficers = ["Salman Ahmad", "Zain Zaidi", "Umair Alee", "Wasiq"];

  onAssignPO(){
    const assignPO = {
      assignOfficer: this.assignedOfficer,
      officerID: this.officerID,
      assignedCompanies: this.assignedCompanies,
      openVacancies: this.openVacancies
    }
    console.log(assignPO);
  }

}
