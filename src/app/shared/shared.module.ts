// Default Module
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { NumberOnlyDirective } from './directives/validation/number-only.directive';
import { DecimalDirective } from './directives/validation/decimal.directive';
import { AlphaNumericDirective } from './directives/validation/alpha-numeric.directive';
import { AlphaNumericLimitedspecialcharactersDirective } from './directives/validation/alpha-numeric-limitedspecialcharacters.directive';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { SharedRoutingModule } from './/shared-routing.module';

import { HseErrorHandlerService } from './services/hse-error-handler.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClickOutsideModule } from 'ng-click-outside';
import { ConvertToPriorityPipe } from './pipes/convert-to-priority.pipe';
import {
  CalendarModule,
  TooltipModule,
  DropdownModule,
  DialogModule,
  AutoCompleteModule,
  PickListModule,
  FileUploadModule,
  RadioButtonModule
} from 'primeng/primeng';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AlertsComponent } from './directives/alerts/alerts.component';
import { LoginComponent } from './components/login/login.component';
import { FileUploadComponent } from './directives/file-upload/file-upload.component';
import { ContractorLoginComponent } from './components/contractor-login/contractor-login.component';
import { EmailValidator } from './directives/validation/email-validation.directive';
import { GoogleChartDirective } from './directives/report/google-chart.directive';
import { ViewRiskRequestByRiskIdComponent } from './../risk/components/view-risk-request-by-risk-id/view-risk-request-by-risk-id.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedRoutingModule,
    CalendarModule,
    TooltipModule,
    DropdownModule,
    DialogModule,
    FileUploadModule,
    ClickOutsideModule,
    RadioButtonModule,
    AutoCompleteModule
  ],
  declarations: [
    HeaderComponent,
    NumberOnlyDirective,
    DecimalDirective,
    AlphaNumericDirective,
    AlphaNumericLimitedspecialcharactersDirective,
    PageNotFoundComponent,
    HomeComponent,
    SideNavComponent,
    AlertsComponent,
    LoginComponent,
    FileUploadComponent,
    ContractorLoginComponent,
    ConvertToPriorityPipe,
    EmailValidator,
    GoogleChartDirective,
    ViewRiskRequestByRiskIdComponent
  ],
  exports: [
    // Default components
    FormsModule,
    CalendarModule,
    TooltipModule,
    DropdownModule,
    HttpClientModule,
    HttpModule,
    DialogModule,
    FileUploadModule,
    NgxPaginationModule,
    PickListModule,
    ClickOutsideModule,
    RadioButtonModule,
    // Custom components
    HeaderComponent,
    NumberOnlyDirective,
    DecimalDirective,
    AlphaNumericDirective,
    AlphaNumericLimitedspecialcharactersDirective,
    SideNavComponent,
    AutoCompleteModule,
    AlertsComponent,
    FileUploadComponent,
    ConvertToPriorityPipe,
    EmailValidator,
    GoogleChartDirective,
    ViewRiskRequestByRiskIdComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: HseErrorHandlerService }]
})
export class SharedModule { }
