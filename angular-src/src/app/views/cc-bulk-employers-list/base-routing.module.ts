import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkemployersComponent } from './bulkemployers.component';
import { CreateemployerComponent } from './createemployer.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulk Employers'
    },
    children: [
      {
        path: 'bulkemployers',
        component: BulkemployersComponent,
        data: {
          title: 'Bulk Employers List'
        }
      },
      {
        path: 'createemployer',
        component: CreateemployerComponent,
        data: {
          title: 'Create Employer'
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
