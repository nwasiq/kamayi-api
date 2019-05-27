import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupreportComponent } from './signupreport.component';
import { CalledstatusreportComponent } from './calledstatusreport.component';
import { PlacementreportComponent } from './placementreport.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'signupreport',
        component: SignupreportComponent,
        data: {
          title: 'Signup Reports'
        }
      }
    ]
  },
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'calledstatusreport',
        component: CalledstatusreportComponent,
        data: {
          title: 'Called Status Reports'
        }
      }
    ]
  },
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'placementreport',
        component: PlacementreportComponent,
        data: {
          title: 'Placement Reports'
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
