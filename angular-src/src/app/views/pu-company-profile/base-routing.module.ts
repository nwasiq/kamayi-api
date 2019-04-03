import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyvacanciesComponent } from './companyvacancies.component';
import { CompanyprofileComponent } from './companyprofile.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'companyvacancies',
        component: CompanyvacanciesComponent,
        data: {
          title: 'Campany Vacancies'
        }
      },
      {
        path: 'companyprofile',
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
