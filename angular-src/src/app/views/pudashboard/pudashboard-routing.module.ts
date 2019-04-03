import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PudashboardComponent } from './pudashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PudashboardComponent,
    data: {
      title: 'Home'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PudashboardRoutingModule {}
