import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationStatusComponent } from './components/observation-status/observation-status.component';
import { ReportRoutingModule } from './/report-routing.module';
import { TrendReportComponent } from './components/trend-report/trend-report.component';
import { ReportService } from './services/report.service';
import { ReportConstantsService } from './services/report-constants.service';
import { ObservationCategoryTrendComponent } from './components/observation-category-trend/observation-category-trend.component';
import { ObservationRequestsTrendComponent } from './components/observation-requests-trend/observation-requests-trend.component';
import { ObservationTypeTrendComponent } from './components/observation-type-trend/observation-type-trend.component';
import { SharedModule } from '../shared/shared.module';
import { ObservationStatusReportComponent } from './components/observation-status-report/observation-status-report.component';
import { ObservationService } from '../observation/services/observation.service';
import { ObservationConstantsService } from '../observation/services/observation-constants.service';
import { BaseService } from '../shared/services/base.service';
import { MultiSelectModule } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule,
    MultiSelectModule
  ],
  declarations: [
    ObservationStatusComponent,
    TrendReportComponent,
    ObservationCategoryTrendComponent,
    ObservationRequestsTrendComponent,
    ObservationTypeTrendComponent,
    ObservationStatusReportComponent
  ],
  providers: [
    ReportService,
    ReportConstantsService,
    ObservationService,
    ObservationConstantsService,
    BaseService,
  ]
})
export class ReportModule { }
