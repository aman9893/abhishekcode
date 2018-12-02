import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { IncidentRoutingModule } from './incident-routing.module';
import { RaiseIncidentComponent } from './components/raise-incident/raise-incident.component';
// import { BaseService } from '../shared/services/base.service';
import { ObservationService } from '../observation/services/observation.service';
import { HseErrorHandlerService } from '../shared/services/hse-error-handler.service';
import { IncidentConstantsService } from './services/incident-constants-service';
import { IncidentService } from './services/incident.service';
import { IncidentDashboardComponent } from './components/incident-dashboard/incident-dashboard.component';
import { IncidentCaseOwnerDashboardComponent } from './components/incident-case-owner-dashboard/incident-case-owner-dashboard.component';
import { ViewRequestDetailsComponent } from './components/view-request-details/view-request-details.component';
import { CloseIncidentRequestComponent } from './components/close-incident-request/close-incident-request.component';
import { ViewIncidentComponent } from './components/view-incident/view-incident.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        IncidentRoutingModule
    ],
    declarations: [
        RaiseIncidentComponent,
        IncidentDashboardComponent,
        IncidentCaseOwnerDashboardComponent,
        ViewRequestDetailsComponent,
        CloseIncidentRequestComponent,
        ViewIncidentComponent
    ],
    providers: [
        // BaseService,
        ObservationService,
        HseErrorHandlerService,
        IncidentConstantsService,
        IncidentService
    ]
})

export class IncidentModule { }
