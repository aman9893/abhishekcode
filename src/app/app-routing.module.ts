import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ContractorLoginComponent } from './shared/components/contractor-login/contractor-login.component';
import { TrendReportComponent } from './report/components/trend-report/trend-report.component';
import { ObservationCategoryTrendComponent } from './report/components/observation-category-trend/observation-category-trend.component';
import { ObservationRequestsTrendComponent } from './report/components/observation-requests-trend/observation-requests-trend.component';
import { ObservationTypeTrendComponent } from './report/components/observation-type-trend/observation-type-trend.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'contractorlogin',
    component: ContractorLoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'observation',
    loadChildren: 'app/observation/observation.module#ObservationModule'
  },
  {
    path: 'actiontracker',
    loadChildren: 'app/actiontracker/actiontracker.module#ActiontrackerModule'
  },
  {
    path: 'masterscreen',
    loadChildren: 'app/masterscreen/masterscreen.module#MasterscreenModule'
  },
  {
    path: 'report',
    loadChildren: 'app/report/report.module#ReportModule'
  },
  {
    path: 'risk',
    loadChildren: 'app/risk/risk.module#RiskModule'
  },
  {
    path: 'incident',
    loadChildren: 'app/incident/incident.module#IncidentModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
