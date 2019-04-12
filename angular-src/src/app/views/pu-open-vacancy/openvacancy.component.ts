import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'openvacancy.component.html'
})
export class OpenvacancyComponent {

  placementUserID: string;
  assignedEmployers: any = [];

  constructor(
    private userService: UserService,
    private route: Router,
  ) {}

  ngOnInit(){

    this.placementUserID = JSON.parse(localStorage.getItem('user'))._id;
    let userid = this.placementUserID;

    this.userService.getOpenVacanciesForPlacementUser(userid).subscribe(data => {
      // console.log(data);
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        if(data.length == 0)
        {
          alert("No vacancy created by you");
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
