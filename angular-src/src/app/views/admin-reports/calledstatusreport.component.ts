import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'calledstatusreport.component.html'
})
export class CalledstatusreportComponent {

  busy: Subscription;
  sortedData: any[];

  callCenterUsers: any;
  
  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  wrongNumber: any = "N/A";
  notAnswered: any = "N/A";
  notCalled: any = "N/A";
  switchedOff: any = "N/A";
  notInterested: any = "N/A";
  callBack: any = "N/A";

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private userService: UserService
  ) { }

  showReport() {
    let selectedDate = new Date(this.date);

    let dateObj = {
      year: selectedDate.getUTCFullYear(),
      month: selectedDate.getUTCMonth(),
      day: selectedDate.getUTCDate()
    }

    this.busy = this.userService.generateCallCenterReport('callStatus', dateObj).subscribe(report => {
      if (report.message) {
        this._flashMessagesService.show(report.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        this.wrongNumber = "N/A";
        this.notAnswered = "N/A";
        this.notCalled = "N/A";
        this.switchedOff = "N/A";
        this.notInterested = "N/A";
        this.callBack = "N/A";
        return;
      }
      let statusObj = report.callCenter.callStatus;
      this.wrongNumber = statusObj["Wrong Number"] ? statusObj["Wrong Number"] : 0;
      this.callBack = statusObj["Call Back"] ? statusObj["Call Back"] : 0;
      this.notInterested = statusObj["Not Interested"] ? statusObj["Not Interested"] : 0;
      this.notCalled = statusObj["Not Called"] ? statusObj["Not Called"] : 0;
      this.notAnswered = statusObj["Not Answered"] ? statusObj["Not Answered"] : 0;
      this.switchedOff = statusObj["Switched Off"] ? statusObj["Switched Off"] : 0;
    });
  }

  ngOnInit(){
    
  }
}
