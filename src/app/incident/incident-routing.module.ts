import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RaiseIncidentComponent } from './components/raise-incident/raise-incident.component';
import { IncidentDashboardComponent } from './components/incident-dashboard/incident-dashboard.component';
import { IncidentCaseOwnerDashboardComponent } from './components/incident-case-owner-dashboard/incident-case-owner-dashboard.component';
import { CloseIncidentRequestComponent } from './components/close-incident-request/close-incident-request.component';
import { ViewIncidentComponent } from './components/view-incident/view-incident.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'incident-dashboard'
    },
     {
        path: 'raise-incident/:incidentId',
        component: RaiseIncidentComponent
     },
    {
        path: 'incident-dashboard',
        component: IncidentDashboardComponent
    },
    {
        path: 'incident-case-owner-dashboard',
        component: IncidentCaseOwnerDashboardComponent
    },
    {
        path: 'close-incident-request/:incidentRequestId',
        component: CloseIncidentRequestComponent
    }
    ,
    {
        path: 'view-incident-request/:incidentRequestId',
        component: ViewIncidentComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class IncidentRoutingModule { }
