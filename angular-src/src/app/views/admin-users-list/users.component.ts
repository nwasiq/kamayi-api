import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent {

  name: string;
  userName: string;
  email: string;
  role: string;
  contactNo: string;

  usersInfo: any;

  // usersInfo = [
  //   {id: '1', name: 'Ahmed Ilyas', userName: 'ahmedilyas', email: 'ahmed@gmail.com', role: 'Admin', contactNo: '03001234567'},
  //   {id: '2', name: 'Honda Atlas', userName: 'honda', email: 'honda@gmail.com', role: 'Admin', contactNo: '03211234567'},
  //   {id: '3', name: 'Ahmed Ilyas', userName: 'ahmedilyas', email: 'ahmed@gmail.com', role: 'Placement', contactNo: '03331234567'},
  //   {id: '4', name: 'Honda Atlas', userName: 'honda', email: 'honda@gmail.com', role: 'CallCenter', contactNo: '03451234567'}
  // ]

  constructor(
    private userService: UserService,
    private crudService: CrudService
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("users").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.usersInfo = data.users;
      }
    });
  }

}
