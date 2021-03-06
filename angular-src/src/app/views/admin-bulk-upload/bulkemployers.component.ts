import { Component } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'bulkemployers.component.html'
})
export class BulkemployersComponent {

  busy: Subscription;

  employersInfo = [
    {id: '1', companyName: 'Honda Atlas', industry: 'Cars', location: 'Islamabad', contactNo: '03331234567', poc: 'Ahmad Ali', status: 'Unassigned'},
    {id: '2', companyName: 'Osaka Batteries', industry: 'Batteries', location: 'Lahore', contactNo: '03001234567', poc: 'Ilyas Muhammad', status: 'Unassigned'},
    {id: '3', companyName: 'Toyota GLI', industry: 'Cars', location: 'Peshawar', contactNo: '03451234567', poc: 'Anwar Ali', status: 'Assigned'}
  ]

  constructor(
    private _flashMessagesService: FlashMessagesService
  ) { }

}
