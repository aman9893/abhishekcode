import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { MasterscreenService } from '../../services/masterscreen.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-admin-master',
  templateUrl: './admin-master.component.html',
  styleUrls: ['./admin-master.component.css']
})
export class AdminMasterComponent implements OnInit {
  companyDetailsResponse: any;
  companyList: SelectItem[];


  constructor(private masterscreenService: MasterscreenService,
    private baseService: BaseService) {
    this.companyList = [];
    this.companyDetailsResponse = [];
  }

  /**
   * Callback method of get company details and save data into variable.
   * @param response - response of request.
   */
  callbackMethodForGetCompanyDetails(response) {
    if (response && response.length > 0) {
      this.companyDetailsResponse = response;
      this.companyList = [];
      this.companyDetailsResponse.forEach((item) => {
        this.companyList.push(
          {
            'label': item.CompanyName,
            'value': item.CompanyId
          }
        );
      });

      this.companyDetailsResponse.forEach((item) => {
        if (item.InActive === true) {
          item.InActive = 'InActive';
        } else {
          item.InActive = 'Active';
        }
      });
    }
  }

  // Reload data for all Master pages
  reloadData() {
    this.ngOnInit();
  }

  // navigate to welcome page
  navigateToWelcomePage() {
    this.baseService.navigateToUrl('masterscreen');
  }
  ngOnInit() {
    // Check User Details
    this.masterscreenService.checkAppAdminDetails();
    // Get Company Details and show into grid
    this.masterscreenService.getCompanyDetails(null, this.callbackMethodForGetCompanyDetails.bind(this));
  }
}
