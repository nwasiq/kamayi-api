import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentComponent } from './assignment.component';
import { JobdeletionComponent } from './jobdeletion.component';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employers'
    },
    children: [
      {
        path: 'assignment',
        component: AssignmentComponent,
        data: {
          title: 'Assignments List'
        }
      },
      {
        path: 'jobdeletion',
        component: JobdeletionComponent,
        data: {
          title: 'Payment'
        }
      },
      {
        path: 'payment',
        component: PaymentComponent,
        data: {
          title: 'Job Deletion'
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
