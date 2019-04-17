// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { EmployersComponent } from './employers.component';
import { EmployersviewComponent } from './employersview.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//ng busy
import {NgBusyModule} from 'ng-busy';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    NgBusyModule
  ],
  declarations: [
    EmployersComponent,
    EmployersviewComponent
  ]
})
export class BaseModule { }
