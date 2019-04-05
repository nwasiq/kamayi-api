import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployersComponent } from './employers.component';
import { EmployersviewComponent } from './employersview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: 'employers',
        component: EmployersComponent,
        data: {
          title: 'Users List'
        }
      },
      {
        path: 'employersview/:id',
        component: EmployersviewComponent,
        data: {
          title: 'User View'
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
