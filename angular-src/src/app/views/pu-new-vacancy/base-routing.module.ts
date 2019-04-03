import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewvacancyComponent } from './newvacancy.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'newvacancy',
        component: NewvacancyComponent,
        data: {
          title: 'New Vacancy'
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
