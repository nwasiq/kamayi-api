import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent {

  fullName: string;
  username: string;
  email: string;
  role: string;
  phone: string;

  usersInfo: any;

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

  onDeleteUser(user){
    let id = JSON.parse(localStorage.getItem("user"))._id;
    if(id == user._id)
    {
      alert("You can not delete yourself.");
    }
    else
    {
      console.log(user._id);
      this.crudService.delete("users", user._id).subscribe(data => {
        alert(data.message);
        window.location.reload();
      });
    }
  }

}
