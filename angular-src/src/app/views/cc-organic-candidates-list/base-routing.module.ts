import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganiccandidatesviewComponent } from './organiccandidatesview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulk Candidates'
    },
    children: [
      {
        path: 'organiccandidatesview',
        component: OrganiccandidatesviewComponent,
        data: {
          title: 'Organic Candidates View'
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
