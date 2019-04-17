import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageshortlistComponent } from './manageshortlist.component';
import { ManagecriteriaComponent } from './managecriteria.component';
import { VacancydetailslistComponent } from './vacancydetailslist.component';
import { VacancydetailsComponent } from './vacancydetails.component';
import { CandidateviewComponent } from './candidateview.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'manageshortlist/:id',
        component: ManageshortlistComponent,
        data: {
          title: 'Manage Short List'
        }
      },
      {
        path: 'managecriteria/:id',
        component: ManagecriteriaComponent,
        data: {
          title: 'Manage Criteria'
        }
      },
      {
        path: 'vacancydetailslist/:id',
        component: VacancydetailslistComponent,
        data: {
          title: 'Vacancy Details List'
        }
      },
      {
        path: 'vacancydetails/:id',
        component: VacancydetailsComponent,
        data: {
          title: 'Vacancy Details'
        }
      },
      {
        path: 'candidateview/:id',
        component: CandidateviewComponent,
        data: {
          title: 'Candidate Details'
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
