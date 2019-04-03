import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkcandidatesComponent } from './bulkcandidates.component';
import { BulkemployersComponent } from './bulkemployers.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulk Data'
    },
    children: [
      {
        path: 'bulkcandidates',
        component: BulkcandidatesComponent,
        data: {
          title: 'Bulk - Candidates'
        }
      },
      {
        path: 'bulkemployers',
        component: BulkemployersComponent,
        data: {
          title: 'Bulk - Employers'
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
