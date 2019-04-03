import { Component } from '@angular/core';

@Component({
  templateUrl: 'vacancydetailslist.component.html'
})
export class VacancydetailslistComponent {

  candidatesInfo = [
    {id: '1', candidateName: 'Ahmed Ilyas', skill: 'Electrician', location: 'Islamabad', contactNo: '03331234567', cnic: '1730112345678', status: 'Interviewed'},
    {id: '2', candidateName: 'Osaka Batteries', skill: 'Mechanic', location: 'Lahore', contactNo: '03001234567', cnic: '1730112345678', status: 'Hired'},
    {id: '3', candidateName: 'Ahmed Ilyas', skill: 'Electrician', location: 'Peshawar', contactNo: '03451234567', cnic: '1730112345678', status: 'Rejected'}
  ]

  constructor() { }

}
