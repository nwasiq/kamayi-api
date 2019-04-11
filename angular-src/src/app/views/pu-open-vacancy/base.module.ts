// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { OpenvacancyComponent } from './openvacancy.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//agm
import { AgmCoreModule } from '@agm/core';

//Search
import { Ng2SearchPipeModule } from 'ng2-search-filter';

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
    OpenvacancyComponent
  ]
})
export class BaseModule { }
