// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { NewvacancyComponent } from './newvacancy.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//agm
import { AgmCoreModule } from '@agm/core';

// Autocomplete
import { AutocompleteComponent } from './google-places.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUiJepm4V6WLT5sJ0FJtkvgUoOzaaguhM'
    })
  ],
  declarations: [
    NewvacancyComponent,
    AutocompleteComponent
  ]
})
export class BaseModule { }
