import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ActiontrackerRoutingModule } from './actiontracker-routing.module';

import { ActiontrackerConstantsService } from './services/actiontracker-constants.service';
import { HseErrorHandlerService } from '../shared/services/hse-error-handler.service';
import { ActiontrackerService } from './services/actiontracker.service';
import { ObservationService } from '../observation/services/observation.service';

import { ActionTrackerDashboardComponent } from './components/action-tracker-dashboard/action-tracker-dashboard.component';
import { ActionDetailsComponent } from './components/action-details/action-details.component';
import { VerifierDashboardComponent } from './components/verifier-dashboard/verifier-dashboard.component';
import { ActionOwnerDashboardComponent } from './components/action-owner-dashboard/action-owner-dashboard.component';
import { ActionOwnerActionComponent } from './components/action-owner-action/action-owner-action.component';
import { ActionPartyDashboardComponent } from './components/action-party-dashboard/action-party-dashboard.component';
import { VerifierViewDetailsComponent } from './components/verifier-view-details/verifier-view-details.component';
import {
    ActionExecutionDetailsReadonlyComponent
} from './components/action-execution-details-readonly/action-execution-details-readonly.component';
import {
    AssignActionByActionownerForRiskComponent
} from './components/assign-action-by-actionowner-for-risk/assign-action-by-actionowner-for-risk.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ActiontrackerRoutingModule
    ],
    declarations: [
        ActionTrackerDashboardComponent,
        ActionDetailsComponent,
        VerifierDashboardComponent,
        ActionOwnerDashboardComponent,
        ActionPartyDashboardComponent,
        ActionOwnerActionComponent,
        ActionExecutionDetailsReadonlyComponent,
        VerifierViewDetailsComponent,
        AssignActionByActionownerForRiskComponent
    ],
    providers: [
        ActiontrackerConstantsService,
        ActiontrackerService,
        HseErrorHandlerService,
        ObservationService
    ]
})

export class ActiontrackerModule { }
