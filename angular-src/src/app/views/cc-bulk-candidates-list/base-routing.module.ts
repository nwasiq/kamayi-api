import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkcandidatesComponent } from './bulkcandidates.component';
import { CreatecandidateComponent } from './createcandidate.component';

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
        path: 'createcandidate',
        component: CreatecandidateComponent,
        data: {
          title: 'Create Candidate'
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
