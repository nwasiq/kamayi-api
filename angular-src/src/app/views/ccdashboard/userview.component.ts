import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'userview.component.html'
})
export class UserviewComponent {

  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
  phone: string;

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private route: Router
  ) { }

  ngOnInit(){
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user);

    this.fullName = user.fullName;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
    this.username = user.username;
  }

  // onSubmitCreateUser(){
  //   if (this.confirmPassword == this.password) 
  //   {
  //     const userData = {
  //       fullName: this.fullname,
  //       username: this.username,
  //       email: this.email,
  //       role: this.role,
  //       password: this.password,
  //       phone: this.phone
  //     }
  //     this.crudService.create(userData, "users").subscribe(data => {
  //       if(data.message)
  //       {
  //         alert(data.message);
  //       }
  //       else
  //       {
  //         alert("User Created!");
  //         this.route.navigate(['/admin-users-list/users']);
  //       }
  //     });
  //   }
  //   else
  //   {
  //     alert("Passwords don't match.");
  //   }
  // }
}