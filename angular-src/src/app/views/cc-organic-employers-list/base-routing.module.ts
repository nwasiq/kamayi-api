import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganicemployersviewComponent } from './organicemployersview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Organic Employers'
    },
    children: [
      {
        path: 'organicemployersview',
        component: OrganicemployersviewComponent,
        data: {
          title: 'Organic Employer Signup'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
