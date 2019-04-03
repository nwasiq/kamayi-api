import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkemployersComponent } from './bulkemployers.component';
import { BulkemployersviewComponent } from './bulkemployersview.component';

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
        path: 'bulkemployersview',
        component: BulkemployersviewComponent,
        data: {
          title: 'Bulk Employer View'
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
