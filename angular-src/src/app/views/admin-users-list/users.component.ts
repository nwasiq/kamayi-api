import { Component } from '@angular/core';

@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent {

  usersInfo = [
    {id: '1', name: 'Ahmed Ilyas', userName: 'ahmedilyas', email: 'ahmed@gmail.com', role: 'Admin', contactNo: '03001234567'},
    {id: '2', name: 'Honda Atlas', userName: 'honda', email: 'honda@gmail.com', role: 'Admin', contactNo: '03211234567'},
    {id: '3', name: 'Ahmed Ilyas', userName: 'ahmedilyas', email: 'ahmed@gmail.com', role: 'Placement', contactNo: '03331234567'},
    {id: '4', name: 'Honda Atlas', userName: 'honda', email: 'honda@gmail.com', role: 'CallCenter', contactNo: '03451234567'}
  ]

  constructor() { }

}
