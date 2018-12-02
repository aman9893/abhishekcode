import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ObservationRoutingModule } from './observation-routing.module';
import { RaiseObservationComponent } from './components/raise-observation/raise-observation.component';
import { ObservationService } from '../observation/services/observation.service';
import { PastObservationsComponent } from './components/past-observations/past-observations.component';
import { HseErrorHandlerService } from '../shared/services/hse-error-handler.service';
import { ObservationDashboardComponent } from './components/observation-dashboard/observation-dashboard.component';
import { HSEAdvisorActionComponent } from './components/hseadvisor-action/hseadvisor-action.Component';
import { ViewRequestsDetailsComponent } from './components/view-requests-details/view-requests-details.component';
import { BackOfficeDashboardComponent } from './components/back-office-dashboard/back-office-dashboard.component';
import { BackOfficeRequestDetailsComponent } from './components/back-office-request-details/back-office-request-details.component';
import { CancelObservationComponent } from './components/cancel-observation/cancel-observation.component';

@NgModule({
  imports: [
    CommonModule,
    ObservationRoutingModule,
    SharedModule
  ],
  declarations: [
    RaiseObservationComponent,
    PastObservationsComponent,
    ObservationDashboardComponent,
    HSEAdvisorActionComponent,
    ViewRequestsDetailsComponent,
    BackOfficeDashboardComponent,
    BackOfficeRequestDetailsComponent,
    CancelObservationComponent
  ],
  providers: [
    ObservationService,
    HseErrorHandlerService
  ]
})
export class ObservationModule { }
