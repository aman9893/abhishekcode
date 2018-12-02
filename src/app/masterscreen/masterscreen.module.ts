import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterscreenRoutingModule } from './/masterscreen-routing.module';
import { AdminMasterComponent } from './components/admin-master/admin-master.component';
import { SharedModule } from '../shared/shared.module';
import { MasterscreenService } from './services/masterscreen.service';
import { CompanyMasterComponent } from './components/company-master/company-master.component';
import { LocationMasterComponent } from './components/location-master/location-master.component';
import { ContractorMasterComponent } from './components/contractor-master/contractor-master.component';
import { MasterscreenConstantsService } from './services/masterscreen-constants.service';
import { ObservationCategoryComponent } from './components/observation-category/observation-category.component';
import { HazardMasterComponent } from './components/hazard-master/hazard-master.component';
import { ObservationTypesComponent } from './components/observation-types/observation-types.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ReminderEscalationComponent } from './components/reminder-escalation/reminder-escalation.component';
import { RoleMappingComponent } from './components/role-mapping/role-mapping.component';
import { RiskAdminMasterComponent } from './components/risk-admin-master/risk-admin-master.component';
import { RiskProjectMasterComponent } from './components/risk-project-master/risk-project-master.component';

@NgModule({
  imports: [
    CommonModule,
    MasterscreenRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminMasterComponent,
    CompanyMasterComponent,
    LocationMasterComponent,
    ContractorMasterComponent,
    ObservationCategoryComponent,
    HazardMasterComponent,
    ObservationTypesComponent,
    WelcomeComponent,
    ReminderEscalationComponent,
    RoleMappingComponent,
    RiskAdminMasterComponent,
    RiskProjectMasterComponent
  ],
  providers: [
    MasterscreenService,
    MasterscreenConstantsService
  ]
})
export class MasterscreenModule { }
