// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { BulkcandidatesComponent } from './bulkcandidates.component';
import { CreatecandidateComponent } from './createcandidate.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//agm
import { AgmCoreModule } from '@agm/core';

// Autocomplete
import { AutocompleteComponent } from './google-places.component';

// Select dropdown with search
import { SelectDropDownModule } from 'ngx-select-dropdown';

//ng busy
import {NgBusyModule} from 'ng-busy';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    SelectDropDownModule,
    NgBusyModule,
    TabsModule,
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUiJepm4V6WLT5sJ0FJtkvgUoOzaaguhM'
    })
  ],
  declarations: [
    BulkcandidatesComponent,
    CreatecandidateComponent,
    AutocompleteComponent
  ]
})
export class BaseModule { }
