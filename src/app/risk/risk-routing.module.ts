import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RaiseRiskComponent } from './components/raise-risk/raise-risk.component';
import { RiskDashboardComponent } from './components/risk-dashboard/risk-dashboard.component';
import { ViewRiskRequestByRiskIdComponent } from './components/view-risk-request-by-risk-id/view-risk-request-by-risk-id.component';
import { RiskDeleteComponent } from './components/risk-delete/risk-delete.component';
import { ViewRiskComponent } from './components/view-risk/view-risk.component';
import { CloseRiskRequestComponent } from './components/close-risk-request/close-risk-request.component';
import { ViewResidualRisksComponent } from './components/view-residual-risks/view-residual-risks.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'raise-risk/:riskId'
  },
  {
    path: 'raise-risk/:riskId',
    component: RaiseRiskComponent
  },
  {
    path: 'risk-dashboard',
    component: RiskDashboardComponent
  },
  {
    path: 'view-risk-request/:riskRequestId',
    component: ViewRiskRequestByRiskIdComponent
  },
  {
    path: 'view-risk-request/:riskRequestId/:actionId',
    component: ViewRiskRequestByRiskIdComponent
  },
  {
    path: 'delete-risk/:riskId',
    component: RiskDeleteComponent
  },
  {
    path: 'view-risk/:riskId',
    component: ViewRiskComponent
  },
  {
    path: 'close-risk/:riskRequestId',
    component: CloseRiskRequestComponent
  },
  {
    path: 'residual-risk-dashboard/:riskRequestId',
    component: ViewResidualRisksComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class RiskRoutingModule { }
