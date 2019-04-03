import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { AdduserComponent } from './adduser.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Users List'
        }
      },
      {
        path: 'adduser',
        component: AdduserComponent,
        data: {
          title: 'Add User'
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
