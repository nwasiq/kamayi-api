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
  }

  selectionChangedVacancies(val)
  {
  }

}
