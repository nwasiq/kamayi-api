import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { UserService } from '../../../services/user/user.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  name: string;

  employerAssignments: number;
  vacancyArchiveApprovals: number;
  notiIds: any = [];

  constructor(
    private userService: UserService,
    private route: Router,
    private notiService: NotificationService
  ) {}

  ngOnInit() {

    this.name = JSON.parse(localStorage.getItem('user'));
    console.log(this.name['role']);
    if(this.name['role'] != "admin" && this.name['role'] != "superAdmin") 
    {
      alert('Permission Denied.');
      this.userService.logout();
      this.route.navigate(['']);
    }

    this.userService.getDashboardDetails().subscribe(data => {
    
    this.employerAssignments = data.employerAssignments;
    this.vacancyArchiveApprovals = data.vacancyArchiveApprovals;

      // this.notiService.getNotifications().subscribe(data2 => {
      //   console.log(data2);
      //   for(let notification of data2){
      //     this.notiIds.push(notification._id);
      //   }
      //   this.notiService.updateReadStatus(this.notiIds).subscribe(data3 => {
      //     console.log(data3.message);
      //   });
      // });
    });
  }
}