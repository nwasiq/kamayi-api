import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import {Sort} from '@angular/material';

@Component({
  templateUrl: 'placementreport.component.html'
})
export class PlacementreportComponent {

  busy: Subscription;
  placementUser: any;
  vacancy: any;
  placementOfficerList: any[];
  placementOfficerVacancies: any [];
  vacanciesDropDownDiv: boolean;
  statusCountDiv: boolean;

  interviewed: any = "N/A";
  notAnswered: any = "N/A";
  rejected: any = "N/A";
  hired: any = "N/A";
  callBack: any = "N/A";
  scheduleInterview: any = "N/A";
  interviewScheduled: any = "N/A";
  joined: any = "N/A";

  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  placementConfig = {
    displayKey: "fullName", //if objects array passed which key to be displayed defaults to description
    search: false,
    limitTo: 20
  };

  vacancyConfig = {
    displayKey: "title", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private userService: UserService
  ) { }

  ngOnInit(){
    this.busy = this.userService.getPlacementUsers().subscribe(data => {
      if (!data.message) {
        this.placementOfficerList = data;
      }
    }); 
  }

  selectionChangedpOfficer(val)
  {
    this.vacancy = 'Select';
    this.statusCountDiv = false;
    let placementId = val.value._id;
    this.busy = this.userService.getOpenVacanciesForPlacementUser(placementId).subscribe(data => {
      console.log(data);
      if (data.message) {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        this.vacanciesDropDownDiv = false;
      }
      else {
        if (data.length == 0) {
          // alert("No vacancy created by you");
          this._flashMessagesService.show("No open vacancies found for selected placement officer", { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
          this.vacanciesDropDownDiv = false;
        }
        else {
          this.vacanciesDropDownDiv = true;
          this.placementOfficerVacancies = data;
        }
      }
    });
  }

  selectionChangedVacancies(val)
  {
    this.vacancy = val.value;
    this.statusCountDiv = false;
  }

  showReport(){

    if (!this.vacancy || this.vacancy == 'Select') {
      this._flashMessagesService.show('Please choose a vacancy', { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      return
    }

    let selectedDate = new Date(this.date);

    let dateObj = {
      year: selectedDate.getUTCFullYear(),
      month: selectedDate.getUTCMonth(),
      day: selectedDate.getUTCDate()
    }

    this.busy = this.userService.generatePlacementReport(this.vacancy._id, dateObj).subscribe(report => {
      // console.log(report);
      if (report.message) {
        this._flashMessagesService.show(report.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        this.interviewed = "N/A";
        this.notAnswered = "N/A";
        this.rejected = "N/A";
        this.interviewScheduled = "N/A";
        this.hired = "N/A";
        this.joined = "N/A";
        this.scheduleInterview = "N/A";
        return;
      }
      this.statusCountDiv = true;
      let statusObj = report.placement.vacancyStatus;
      this.interviewed = statusObj["Interviewed"] ? statusObj["Interviewed"] : 0;
      this.joined = statusObj["Joined"] ? statusObj["Joined"] : 0;
      this.hired = statusObj["Hired"] ? statusObj["Hired"] : 0;
      this.rejected = statusObj["Rejected"] ? statusObj["Rejected"] : 0;
      this.notAnswered = statusObj["Not Answered"] ? statusObj["Not Answered"] : 0;
      this.interviewScheduled = statusObj["Interview Scheduled"] ? statusObj["Interview Scheduled"] : 0;
      this.scheduleInterview = statusObj["Schedule Interview"] ? statusObj["Schedule Interview"] : 0;
    })
  }

}
