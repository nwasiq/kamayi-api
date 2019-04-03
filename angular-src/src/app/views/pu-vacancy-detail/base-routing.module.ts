import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageshortlistComponent } from './manageshortlist.component';
import { ManagecriteriaComponent } from './managecriteria.component';
import { VacancydetailslistComponent } from './vacancydetailslist.component';
import { VacancydetailsComponent } from './vacancydetails.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'manageshortlist',
        component: ManageshortlistComponent,
        data: {
          title: 'Manage Short List'
        }
      },
      {
        path: 'managecriteria',
        component: ManagecriteriaComponent,
        data: {
          title: 'Manage Criteria'
        }
      },
      {
        path: 'vacancydetailslist',
        component: VacancydetailslistComponent,
        data: {
          title: 'Vacancy Details List'
        }
      },
      {
        path: 'vacancydetails',
        component: VacancydetailsComponent,
        data: {
          title: 'Vacancy Details'
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
