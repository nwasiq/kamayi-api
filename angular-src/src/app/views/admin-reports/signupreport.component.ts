import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'signupreport.component.html'
})
export class SignupreportComponent {

  busy: Subscription;

  callCenterUsers: any;
  
  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private userService: UserService
  ) { }

  ngOnInit(){
    
  }

  showReport(){
    let selectedDate = new Date(this.date);

    let dateObj = {
      year: selectedDate.getUTCFullYear(),
      month: selectedDate.getUTCMonth(),
      day: selectedDate.getUTCDate()
    }
    
    this.busy = this.userService.generateCallCenterReport('signups', dateObj).subscribe( report => {
      console.log(report);
      if(report.message){
        this._flashMessagesService.show(report.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        this.callCenterUsers = [];
        return;
      }
      this.callCenterUsers = report.callCenter.signups;
    });
  }
}
