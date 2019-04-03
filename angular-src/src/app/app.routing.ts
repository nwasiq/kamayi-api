import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { CcDefaultLayoutComponent } from './containers';
import { PuDefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from '../services/authGuard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent, canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'admin-users-list',
        loadChildren: './views/admin-users-list/base.module#BaseModule'
      },
      {
        path: 'admin-bulk-upload',
        loadChildren: './views/admin-bulk-upload/base.module#BaseModule'
      },
      {
        path: 'admin-employers-list',
        loadChildren: './views/admin-employers-list/base.module#BaseModule'
      },
      {
        path: 'admin-candidate-list',
        loadChildren: './views/admin-candidate-list/base.module#BaseModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      }
    ]
  },
  {
    path: '',
    component: CcDefaultLayoutComponent, canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'cc-candidates-list',
        loadChildren: './views/cc-candidates-list/base.module#BaseModule'
      },
      {
        path: 'cc-employers-list',
        loadChildren: './views/cc-employers-list/base.module#BaseModule'
      },
      {
        path: 'cc-bulk-candidates-list',
        loadChildren: './views/cc-bulk-candidates-list/base.module#BaseModule'
      },
      {
        path: 'cc-bulk-employers-list',
        loadChildren: './views/cc-bulk-employers-list/base.module#BaseModule'
      },
      {
        path: 'ccdashboard',
        loadChildren: './views/ccdashboard/ccdashboard.module#CcdashboardModule'
      }
    ]
  },
  {
    path: '',
    component: PuDefaultLayoutComponent, canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'pu-vacancy-detail',
        loadChildren: './views/pu-vacancy-detail/base.module#BaseModule'
      },
      {
        path: 'pu-open-vacancy',
        loadChildren: './views/pu-open-vacancy/base.module#BaseModule'
      },
      {
        path: 'pu-company-profile',
        loadChildren: './views/pu-company-profile/base.module#BaseModule'
      },
      {
        path: 'pu-assigned-employers',
        loadChildren: './views/pu-assigned-employers/base.module#BaseModule'
      },
      {
        path: 'pu-new-vacancy',
        loadChildren: './views/pu-new-vacancy/base.module#BaseModule'
      },
      {
        path: 'pudashboard',
        loadChildren: './views/pudashboard/pudashboard.module#PudashboardModule'
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
