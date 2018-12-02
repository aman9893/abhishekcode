import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ActionTrackerDashboardComponent } from './components/action-tracker-dashboard/action-tracker-dashboard.component';
import { ActionDetailsComponent } from './components/action-details/action-details.component';
import { VerifierDashboardComponent } from './components/verifier-dashboard/verifier-dashboard.component';
import { ActionOwnerDashboardComponent } from './components/action-owner-dashboard/action-owner-dashboard.component';
import { ActionPartyDashboardComponent } from './components/action-party-dashboard/action-party-dashboard.component';
import { ActionOwnerActionComponent } from './components/action-owner-action/action-owner-action.component';
import { VerifierViewDetailsComponent } from './components/verifier-view-details/verifier-view-details.component';
import {
    ActionExecutionDetailsReadonlyComponent
} from './components/action-execution-details-readonly/action-execution-details-readonly.component';
import {
    AssignActionByActionownerForRiskComponent
} from './components/assign-action-by-actionowner-for-risk/assign-action-by-actionowner-for-risk.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'action-party-dashboad'
    },
    {
        path: 'action-party-dashboard',
        component: ActionTrackerDashboardComponent
    },
    {
        path: 'action-details/:actionId',
        component: ActionDetailsComponent
    },
    {
        path: 'verifier-dashboard',
        component: VerifierDashboardComponent
    },
    {
        path: 'action-owner-dashboard',
        component: ActionOwnerDashboardComponent
    },
    {
        path: 'view-details/:actionId',
        component: ActionOwnerActionComponent
    },
    {
        path: 'action-execution-details/:actionId',
        component: ActionExecutionDetailsReadonlyComponent
    },
    {
        path: 'action-verifier-viewdetails/:actionId',
        component: VerifierViewDetailsComponent
    },
    {
        path: 'assign-action-for-risk/:riskRequestId/:actionId',
        component: AssignActionByActionownerForRiskComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class ActiontrackerRoutingModule { }
