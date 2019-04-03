import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { CcdashboardComponent } from './ccdashboard.component';
import { CcdashboardRoutingModule } from './ccdashboard-routing.module';


@NgModule({
  imports: [
    FormsModule,
    CcdashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ CcdashboardComponent ]
})
export class CcdashboardModule { }
