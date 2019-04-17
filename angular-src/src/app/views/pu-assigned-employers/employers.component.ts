import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import {CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'employers.component.html'
})
export class EmployersComponent {

  busy: Subscription;

  search: any;
  userID: string;
  employersInfo: any = [];

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){

    this.userID = JSON.parse(localStorage.getItem('user'))._id;
    let userid = this.userID;
    // console.log(userid);

    this.busy = this.userService.getEmployersForPlacementUser(userid).subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        if(data.employers.length == 0)
        {
          // alert("No employers assigned to you");
          this._flashMessagesService.show("No employers assigned to you", { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
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
