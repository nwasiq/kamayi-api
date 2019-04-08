// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { CandidateComponent } from './candidate.component';
import { CandidateviewComponent } from './candidateview.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// Select dropdown with search
import { SelectDropDownModule } from 'ngx-select-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    SelectDropDownModule
  ],
  declarations: [
    CandidateComponent,
    CandidateviewComponent
  ]
})
export class BaseModule { }
