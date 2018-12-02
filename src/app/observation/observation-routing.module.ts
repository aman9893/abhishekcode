import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RaiseObservationComponent } from './components/raise-observation/raise-observation.component';
import { PastObservationsComponent } from './components/past-observations/past-observations.component';
import { ObservationDashboardComponent } from './components/observation-dashboard/observation-dashboard.component';
import { HSEAdvisorActionComponent } from './components/hseadvisor-action/hseadvisor-action.Component';
import { ViewRequestsDetailsComponent } from './components/view-requests-details/view-requests-details.component';
import { BackOfficeDashboardComponent } from './components/back-office-dashboard/back-office-dashboard.component';
import { BackOfficeRequestDetailsComponent } from './components/back-office-request-details/back-office-request-details.component';
import { CancelObservationComponent } from './components/cancel-observation/cancel-observation.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'raise-observation/:observationId'
  },
  {
    path: 'raise-observation/:observationId',
    component: RaiseObservationComponent
  },
  {
    path: 'past-observations-dashboard',
    component: PastObservationsComponent
  },
  {
    path: 'cancel-observation/:observationId',
    component: CancelObservationComponent
  },
  {
    path: 'observation-card-dashboard',
    component: ObservationDashboardComponent
  },
  {
    path: 'hseadvisor-action/:observationId',
    component: HSEAdvisorActionComponent
  },
  {
    path: 'view-requests/:observationId',
    component: ViewRequestsDetailsComponent
  },
  {
    path: 'back-office-dashboard',
    component: BackOfficeDashboardComponent
  },
  {
    path: 'back-office-request-details/:tempObservationId',
    component: BackOfficeRequestDetailsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ObservationRoutingModule { }
