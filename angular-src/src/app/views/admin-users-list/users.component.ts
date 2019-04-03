import { Component } from '@angular/core';

@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent {

  candidatesInfo = [
    {id: '1', candidateName: 'Ahmed Ilyas', primarySkill: 'Mechnical', location: 'Lahore', contactNo: '03001234567', institute: 'Hunar Kada', cnicNo: '67405694949'},
    {id: '2', candidateName: 'Honda Atlas', primarySkill: 'Electrical', location: 'Islamabad', contactNo: '03331234567', institute: 'NIIT', cnicNo: '115655884949'},
    {id: '3', candidateName: 'Ahmed Ilyas', primarySkill: 'Mechnical', location: 'Karachi', contactNo: '03211234567', institute: 'Hunar Kada', cnicNo: '67405694949'},
    {id: '4', candidateName: 'Honda Atlas', primarySkill: 'Electrical', location: 'Peshawar', contactNo: '03451234567', institute: 'NIIT', cnicNo: '115655884949'}
  ]

  constructor() { }

}
