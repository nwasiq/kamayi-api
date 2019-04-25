import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { UserService } from '../../../services/user/user.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  templateUrl: 'pudashboard.component.html'
})
export class PudashboardComponent implements OnInit {

  name: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private notiService: NotificationService
    ) {}

  ngOnInit() {
    this.name = JSON.parse(localStorage.getItem('user'));
    if(this.name['role'] == "callCenter")
    {
      alert('Permission Denied.');
      this.userService.logout();
      this.router.navigate(['']);
    }
    this.notiService.getNotifications(true).subscribe(data => {
      console.log(data);
    });
  }
}
