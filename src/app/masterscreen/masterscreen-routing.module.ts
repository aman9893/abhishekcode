import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminMasterComponent } from './components/admin-master/admin-master.component';
import { CompanyMasterComponent } from './components/company-master/company-master.component';
import { LocationMasterComponent } from './components/location-master/location-master.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ReminderEscalationComponent } from './components/reminder-escalation/reminder-escalation.component';
import { RiskAdminMasterComponent } from './components/risk-admin-master/risk-admin-master.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome'
      },

      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'admin-master',
        component: AdminMasterComponent
      },
      {
        path: 'risk-admin-master',
        component: RiskAdminMasterComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MasterscreenRoutingModule { }
