import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';

import { RaiseRiskComponent } from './components/raise-risk/raise-risk.component';
import { RiskRoutingModule } from './risk-routing.module';

import { RiskConstantsService } from './services/risk-constants.service';
import { RiskService } from './services/risk.service';
import { RiskDashboardComponent } from './components/risk-dashboard/risk-dashboard.component';
import { RiskDeleteComponent } from './components/risk-delete/risk-delete.component';
import { ViewRiskComponent } from './components/view-risk/view-risk.component';
import { CloseRiskRequestComponent } from './components/close-risk-request/close-risk-request.component';
import { ViewResidualRisksComponent } from './components/view-residual-risks/view-residual-risks.component';

@NgModule({
  imports: [
    CommonModule,
    RiskRoutingModule,
    SharedModule
  ],
  declarations:
  [
    RaiseRiskComponent,
    RiskDashboardComponent,
    RiskDeleteComponent,
    ViewRiskComponent,
    CloseRiskRequestComponent,
    ViewResidualRisksComponent
  ],
  providers: [
    RiskService,
    RiskConstantsService
  ]
})
export class RiskModule { }
