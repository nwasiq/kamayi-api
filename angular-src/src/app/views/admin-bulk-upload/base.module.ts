// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { BulkcandidatesComponent } from './bulkcandidates.component';
import { BulkemployersComponent } from './bulkemployers.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//ng busy
import {NgBusyModule} from 'ng-busy';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    NgBusyModule
  ],
  declarations: [
    BulkcandidatesComponent,
    BulkemployersComponent
  ]
})
export class BaseModule { }
