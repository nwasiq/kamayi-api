import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import {Sort} from '@angular/material';

@Component({
  templateUrl: 'calledstatusreport.component.html'
})
export class CalledstatusreportComponent {

  busy: Subscription;
  sortedData: any[];

  ccUser: string;
  callCenterUsers: any;
  
  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  constructor(
    private route: Router,
    private crudService: CrudService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
    
  }
}
