import { Component, OnInit } from '@angular/core';
import { BaseService } from './../../../shared/services/base.service';

@Component({
  selector: 'app-risk-admin-master',
  templateUrl: './risk-admin-master.component.html',
  styleUrls: ['./risk-admin-master.component.css']
})
export class RiskAdminMasterComponent implements OnInit {

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    console.log('working');
  }

    // Navigate to welcome page
    navigateToWelcomePage() {
      this.baseService.navigateToUrl('masterscreen');
    }

}
