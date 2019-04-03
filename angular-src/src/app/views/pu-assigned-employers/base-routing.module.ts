import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployersComponent } from './employers.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'employers',
        component: EmployersComponent,
        data: {
          title: 'Assigned Employers'
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
