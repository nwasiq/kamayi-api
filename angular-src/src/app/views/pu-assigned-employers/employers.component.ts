import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import {CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'employers.component.html'
})
export class EmployersComponent {

  search: any;
  userID: string;
  employersInfo: any = [];

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private route: Router,
  ) { }

  ngOnInit(){

    this.userID = JSON.parse(localStorage.getItem('user'))._id;
    let userid = this.userID;
    // console.log(userid);

    this.userService.getEmployersForPlacementUser(userid).subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        if(data.employers.length == 0)
        {
          alert("No employers assigned to you");
          return;
        }
        this.employersInfo = data.employers;
        // console.log(this.employersInfo);
      }
    });
  }

  viewEmployerDetails(employer)
  {
    // localStorage.setItem("employerid", employer._id);
    this.route.navigate(['/pu-company-profile/companyprofile/' + employer._id]);
  }

}
