import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';
import { CrudService } from '../services/crud/crud.service';
import { UserService } from '../services/user/user.service';
import { VacancyService } from '../services/vacancy/vacancy.service';
import { NotificationService } from '../services/notification/notification.service';
import { BulkCandidateService } from '../services/bulkCandidate/bulk-candidate.service';
import { AuthGuard } from '../services/authGuard/auth.guard';
import { EmployerService } from '../services/employer/employer.service';
import { PagerService } from '../services/pager.service';
 
// Import containers
import { DefaultLayoutComponent } from './containers';
import { CcDefaultLayoutComponent } from './containers';
import { PuDefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent,
  CcDefaultLayoutComponent,
  PuDefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpInterceptor } from '../services/httpInterceptor';

// flash message module
import { FlashMessagesModule } from 'angular2-flash-messages';

//ng busy
import {NgBusyModule} from 'ng-busy';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    HttpModule,
    NgBusyModule,
    FlashMessagesModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUiJepm4V6WLT5sJ0FJtkvgUoOzaaguhM' //needs to be changed
    })
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent
  ],
  providers: [
    CrudService, 
    AuthGuard, 
    HttpInterceptor,
    UserService,
    EmployerService,
    BulkCandidateService,
    VacancyService,
    NotificationService,
    PagerService,
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
