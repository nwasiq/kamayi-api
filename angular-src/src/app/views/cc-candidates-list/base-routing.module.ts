import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateComponent } from './candidate.component';
import { CandidateviewComponent } from './candidateview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Candidates'
    },
    children: [
      {
        path: 'candidate',
        component: CandidateComponent,
        data: {
          title: 'Candidates List'
        }
      },
      {
        path: 'candidateview',
        component: CandidateviewComponent,
        data: {
          title: 'Candidate View'
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
