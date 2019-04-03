import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { PudashboardComponent } from './pudashboard.component';
import { PudashboardRoutingModule } from './pudashboard-routing.module';

@NgModule({
  imports: [
    FormsModule,
    PudashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ PudashboardComponent ]
})
export class PudashboardModule { }
