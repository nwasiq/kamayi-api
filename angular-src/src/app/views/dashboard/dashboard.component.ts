import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { UserService } from '../../../services/user/user.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  employerAssignments: number;
  vacancyArchiveApprovals: number;

  constructor(
    private userService: UserService,
    private route: Router
  ) {}

  ngOnInit() {
    this.userService.getDashboardDetails().subscribe(data => {
    console.log(data);
    
    this.employerAssignments = data.employerAssignments;
    this.vacancyArchiveApprovals = data.vacancyArchiveApprovals;
    })
  }
}