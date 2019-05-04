// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ManageshortlistComponent } from './manageshortlist.component';
import { ManagecriteriaComponent } from './managecriteria.component';
import { VacancydetailslistComponent } from './vacancydetailslist.component';
import { VacancydetailsComponent } from './vacancydetails.component';
import { CandidateviewComponent } from './candidateview.component';

// Date Picker
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//agm
import { AgmCoreModule } from '@agm/core';

// Autocomplete
import { AutocompleteComponent } from './google-places.component';

//ng busy
import {NgBusyModule} from 'ng-busy';

// Mat Sort
import {MatSortModule} from '@angular/material/sort';

import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    AngularDateTimePickerModule,
    NgBusyModule,
    MatSortModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUiJepm4V6WLT5sJ0FJtkvgUoOzaaguhM'
    })
  ],
  declarations: [
    ManageshortlistComponent,
    ManagecriteriaComponent,
    VacancydetailslistComponent,
    VacancydetailsComponent,
    AutocompleteComponent,
    CandidateviewComponent
  ]
})
export class BaseModule { }
