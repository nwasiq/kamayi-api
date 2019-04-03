// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { CompanyvacanciesComponent } from './companyvacancies.component';
import { CompanyprofileComponent } from './companyprofile.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//agm
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUiJepm4V6WLT5sJ0FJtkvgUoOzaaguhM'
    })
  ],
  declarations: [
    CompanyvacanciesComponent,
    CompanyprofileComponent
  ]
})
export class BaseModule { }