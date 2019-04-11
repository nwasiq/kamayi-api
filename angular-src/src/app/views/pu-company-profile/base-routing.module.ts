import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyprofileComponent } from './companyprofile.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'companyprofile/:id',
        component: CompanyprofileComponent,
        data: {
          title: 'Company Profile'
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
