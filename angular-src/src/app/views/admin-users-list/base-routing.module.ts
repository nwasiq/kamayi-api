import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { UserviewComponent } from './userview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
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
        path: 'userview',
        component: UserviewComponent,
        data: {
          title: 'User View'
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
