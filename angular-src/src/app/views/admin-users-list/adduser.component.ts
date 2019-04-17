import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

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
    private route: Router,
    private _flashMessagesService: FlashMessagesService
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
          // alert(data.message);
          this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
        }
        else
        {
          // alert("User Created!");
          this._flashMessagesService.show("User Created!", { cssClass: 'alert-success text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
          this.route.navigate(['/admin-users-list/users']);
        }
      });
    }
    else
    {
      this._flashMessagesService.show("Passwords don't match.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      // alert("Passwords don't match.");
    }
  }
}