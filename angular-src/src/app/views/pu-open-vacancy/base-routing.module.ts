import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenvacancyComponent } from './openvacancy.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'openvacancy',
        component: OpenvacancyComponent,
        data: {
          title: 'Open Vacancies'
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
