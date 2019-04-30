import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';

import { Router } from '@angular/router';
import { UserService} from '../../../services/user/user.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {

  name: any;
  role: any;

  unreadCount: number;
  totalNotis: any = [];

  notiIds: any = [];

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(@Inject(DOCUMENT) _document: any,
  private router: Router,
  private userService: UserService,
  private notiService: NotificationService
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

    this.notiService.getNotifications().subscribe(data => {
      this.unreadCount = data.unreadCount;
      this.totalNotis = data.notifications;
    });

  }

  notiClick(){
    // console.log("Noti clicked");
    for(let notification of this.totalNotis){
      this.notiIds.push(notification._id);
    }
    this.notiService.updateReadStatus(this.notiIds).subscribe(data1 => {
      this.unreadCount = 0;
    });
  }

  onViewUser(user){
    localStorage.setItem("userid", user);
    this.router.navigate(['/dashboard/userview']);
  }

  onLogout(){
    {
      this.userService.logout();
      this.router.navigate(['']);
    }
  }
}
