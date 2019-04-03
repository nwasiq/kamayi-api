import { Component } from '@angular/core';

@Component({
  templateUrl: 'adduser.component.html'
})
export class AdduserComponent {

  roleOf = ["admin", "placement", "callCenter"];

  fullname: string;
  username: string;
  email: string;
  role: string;
  password: string;
  phone: string;

  constructor() { }

  onSubmitCreateUser(){
    const userData = {
      fullname: this.fullname,
      username: this.username,
      email: this.email,
      role: this.role,
      password: this.password,
      phone: this.phone
    }
    console.log(userData);
  }
}