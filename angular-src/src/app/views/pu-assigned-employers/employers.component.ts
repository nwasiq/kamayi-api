import { Component } from '@angular/core';

@Component({
  templateUrl: 'employers.component.html'
})
export class EmployersComponent {

  search: any;
  candidatesInfo = [
    {id: '1', companyName: 'Honda Atlas', industry: 'Cars', location: 'Lahore', contactNo: '03001234567', poc: 'Ahmed Ali', assignmentDate: '1/12/2018'},
    {id: '2', companyName: 'Osaka Batteries', industry: 'Batteries', location: 'Islamabad', contactNo: '03331234567', poc: 'Ilyas Muhammad', assignmentDate: '1/10/2018'},
    {id: '3', companyName: 'Honda Atlas', industry: 'Cars', location: 'Lahore', contactNo: '03001234567', poc: 'Ahmed Ali', assignmentDate: '1/12/2018'},
    {id: '4', companyName: 'Osaka Batteries', industry: 'Batteries', location: 'Islamabad', contactNo: '03331234567', poc: 'Ilyas Muhammad', assignmentDate: '1/10/2018'}
  ]

  constructor() { }

}
