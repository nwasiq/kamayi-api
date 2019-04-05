import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateoccupationComponent } from './createoccupation.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'createoccupation',
        component: CreateoccupationComponent,
        data: {
          title: 'Create Occupation'
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
