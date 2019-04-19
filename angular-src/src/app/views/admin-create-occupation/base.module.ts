// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { CreateoccupationComponent } from './createoccupation.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

//ng busy
import {NgBusyModule} from 'ng-busy';

// Mat Sort
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    NgBusyModule,
    MatSortModule,
    ModalModule.forRoot()
  ],
  declarations: [
    CreateoccupationComponent
  ]
})
export class BaseModule { }
