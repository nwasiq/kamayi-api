import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CcdashboardComponent } from './ccdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CcdashboardComponent,
    data: {
      title: 'Home'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CcdashboardRoutingModule {}
