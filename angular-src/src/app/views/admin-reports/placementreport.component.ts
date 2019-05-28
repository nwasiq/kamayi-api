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
  education1: any;
  educationOf1: any = ['E1', 'E2', 'E3', 'E4'];
  educationOf2: any = ['E1', 'E2', 'E3', 'E4'];
  vacanciesDropDownDiv: boolean;
  statusCountDiv: boolean;

  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  config1 = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 20
  };

  constructor(
    private route: Router,
    private crudService: CrudService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
  }

  selectionChangedpOfficer(val)
  {
    this.vacanciesDropDownDiv = true;
    this.statusCountDiv = false;
  }

  selectionChangedVacancies(val)
  {
    this.statusCountDiv = true;
  }

}
