// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { SignupreportComponent } from './signupreport.component';
import { CalledstatusreportComponent } from './calledstatusreport.component';
import { PlacementreportComponent } from './placementreport.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//ng busy
import {NgBusyModule} from 'ng-busy';

// Mat Sort
import {MatSortModule} from '@angular/material/sort';

// Date Picker
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

// Select dropdown with search
import { SelectDropDownModule } from 'ngx-select-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    NgBusyModule,
    MatSortModule,
    AngularDateTimePickerModule,
    SelectDropDownModule
  ],
  declarations: [
    SignupreportComponent,
    CalledstatusreportComponent,
    PlacementreportComponent
  ]
})
export class BaseModule { }
