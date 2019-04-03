import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkcandidatesComponent } from './bulkcandidates.component';
import { BulkcandidatesviewComponent } from './bulkcandidatesview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulk Candidates'
    },
    children: [
      {
        path: 'bulkcandidates',
        component: BulkcandidatesComponent,
        data: {
          title: 'Bulk Candidates List'
        }
      },
      {
        path: 'bulkcandidatesview',
        component: BulkcandidatesviewComponent,
        data: {
          title: 'Bulk Candidates View'
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
