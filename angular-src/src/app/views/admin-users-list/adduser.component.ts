import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { Router } from '@angular/router';

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
  confirmPassword: string;
  phone: string;

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private route: Router
  ) { }

  onSubmitCreateUser(){
    if (this.confirmPassword == this.password) 
    {
      const userData = {
        fullName: this.fullname,
        username: this.username,
        email: this.email,
        role: this.role,
        password: this.password,
        phone: this.phone
      }
      this.crudService.create(userData, "users").subscribe(data => {
        if(data.message)
        {
          alert(data.message);
        }
        else
        {
          alert("User Created!");
          this.route.navigate(['/admin-users-list/users']);
        }
      });
    }
    else
    {
      alert("Passwords don't match.");
    }
  }
}