import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent {

  busy: Subscription;

  fullName: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  search: any;
  usersInfo: any;

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
    this.busy = this.crudService.retrieveAll("users").subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        this.usersInfo = data.users;
      }
    });
  }

  onDeleteUser(user){
    let id = JSON.parse(localStorage.getItem("user"))._id;
    if(id == user._id)
    {
      // alert("You can not delete yourself.");
      this._flashMessagesService.show("You can not delete yourself.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
    }
    else
    {
      // console.log(user._id);
      this.crudService.delete("users", user._id).subscribe(data => {
        // alert(data.message);
      this._flashMessagesService.show(data.message, { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function(){ 
        location.reload(); 
      }, 1000);
      });
    }
  }

}
