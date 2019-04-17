// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';


import { AssignmentComponent } from './assignment.component';
import { JobdeletionComponent } from './jobdeletion.component';
import { PaymentComponent } from './payment.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// Select dropdown with search
import { SelectDropDownModule } from 'ngx-select-dropdown';

//ng busy
import {NgBusyModule} from 'ng-busy';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    SelectDropDownModule,
    TabsModule,
    NgBusyModule,
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUiJepm4V6WLT5sJ0FJtkvgUoOzaaguhM'
    })
  ],
  declarations: [
    AssignmentComponent,
    JobdeletionComponent,
    PaymentComponent
  ]
})
export class BaseModule { }
