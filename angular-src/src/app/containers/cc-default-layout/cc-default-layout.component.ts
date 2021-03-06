import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ccnavItems } from '../../_ccnav';

import { Router } from '@angular/router';
import { UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './cc-default-layout.component.html'
})
export class CcDefaultLayoutComponent implements OnDestroy {

  name: any;
  role: any;

  public navItems = ccnavItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(@Inject(DOCUMENT) _document: any,
  private router: Router,
  private userService: UserService
  ) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  ngOnInit(){
    this.name = JSON.parse(localStorage.getItem('user')).fullName;
    this.role = JSON.parse(localStorage.getItem('user')).role;
    // console.log("Name: " + this.name);
  }

  onViewUser(user){
    localStorage.setItem("userid", user);
    this.router.navigate(['/ccdashboard/userview']);
  }

  onLogout(){
    console.log("Logout Clicked.");
    {
      this.userService.logout();
      this.router.navigate(['']);
    }
  }
}
