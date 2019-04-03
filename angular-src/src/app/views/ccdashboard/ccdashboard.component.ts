import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { UserService} from '../../../services/user/user.service';

@Component({
  templateUrl: 'ccdashboard.component.html'
})
export class CcdashboardComponent implements OnInit {

  name: string;

  constructor(
    private router: Router,
    private userService: UserService
    ) {}
  
  ngOnInit() {
    this.name = JSON.parse(localStorage.getItem('user'));
    if(this.name['role'] == "placement")
    {
      alert('Permission Denied.');
      this.userService.logout();
      this.router.navigate(['']);
    }
  }
}