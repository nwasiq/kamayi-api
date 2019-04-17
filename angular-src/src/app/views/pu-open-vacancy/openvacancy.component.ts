import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'openvacancy.component.html'
})
export class OpenvacancyComponent {

  busy: Subscription;

  placementUserID: string;
  assignedEmployers: any = [];
  search: string;

  constructor(
    private userService: UserService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit(){

    this.placementUserID = JSON.parse(localStorage.getItem('user'))._id;
    let userid = this.placementUserID;

    this.busy = this.userService.getOpenVacanciesForPlacementUser(userid).subscribe(data => {
      // console.log(data);
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        if(data.length == 0)
        {
          // alert("No vacancy created by you");
          this._flashMessagesService.show("No vacancy created by you", { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
          this.route.navigate(['/pudashboard']);
        }
        else
        {
          this.assignedEmployers = data;
        }
      }
    });
  }

  viewVacancyDetails(vacancy)
  {
    this.route.navigate(['/pu-vacancy-detail/vacancydetails/' + vacancy._id]);
  }

}
