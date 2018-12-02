import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ObservationTypeTrendComponent } from './components/observation-type-trend/observation-type-trend.component';
import { ObservationRequestsTrendComponent } from './components/observation-requests-trend/observation-requests-trend.component';
import { ObservationCategoryTrendComponent } from './components/observation-category-trend/observation-category-trend.component';
import { TrendReportComponent } from './components/trend-report/trend-report.component';
import { ObservationStatusReportComponent } from './components/observation-status-report/observation-status-report.component';

const reportRoutes: Routes =  [
  {
    path: 'observation-category-trend-report',
    component: ObservationCategoryTrendComponent
  },
  {
    path: 'observation-requests-trend-report',
    component: ObservationRequestsTrendComponent
  },
  {
    path: 'observation-type-trend-report',
    component: ObservationTypeTrendComponent
  },
  {
    path: 'action-trend-report',
    component: TrendReportComponent
  },
  {
    path: 'observation-status-report',
    component: ObservationStatusReportComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(reportRoutes)
  ],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
