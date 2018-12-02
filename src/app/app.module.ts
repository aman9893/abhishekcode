import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthenticationService } from './shared/services/authentication.service';
import { Adal4Service } from 'adal-angular4';
import { Adal4HTTPService } from 'adal-angular4/adal4-http.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ReportModule } from './report/report.module';
import { BaseService } from './shared/services/base.service';
import { ConstantsService } from './shared/services/constants.service';
import { DataService } from './shared/services/data.service';
import { CommonService } from './shared/services/common.service';
import { RiskModule } from './risk/risk.module';
import { IncidentModule } from './incident/incident.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReportModule,
    RiskModule,
    IncidentModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthenticationService,
    BaseService,
    DataService,
    ConstantsService,
    CommonService,
    Adal4Service,
    {
        provide: Adal4HTTPService,
        useFactory: Adal4HTTPService.factory,
        deps: [Http, Adal4Service]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
