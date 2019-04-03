import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PudashboardComponent } from './pudashboard.component';
import { UserviewComponent } from './userview.component';

const routes: Routes = [
  {
    path: '',
    component: PudashboardComponent,
    data: {
      title: 'Home'
    }
  }
  ,
  {
    path: 'userview',
    component: UserviewComponent,
    data: {
      title: 'User Profile'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PudashboardRoutingModule {}
