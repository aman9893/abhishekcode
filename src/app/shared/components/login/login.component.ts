import { Employee } from './../../../observation/model/employee.model';
import { Component, OnInit } from '@angular/core';

import { Adal4Service } from 'adal-angular4/adal4.service';
import { Adal4HTTPService } from 'adal-angular4/adal4-http.service';
import { AuthenticationService } from '../../services/authentication.service';
import { BaseService } from '../../services/base.service';
import { DataService } from '../..//services/data.service';
import { ConstantsService } from '../../services/constants.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private dataService: DataService
    , private authenticationService: AuthenticationService
    , private baseService: BaseService
    , private commonService: CommonService
    , private adal4Service: Adal4Service) { }

  ngOnInit() {
    if (this.adal4Service && this.adal4Service.userInfo && !this.adal4Service.userInfo.authenticated) {
      this.baseService.showRootLoader = false;
    }
  }

  openContractorLoginWindow() {
    this.baseService.navigateToUrl('contractorlogin');
  }

  /**
    * Fetch user domain details for initializing ADAL service.
    */
  getUserDomainDetails() {
      this.baseService.setItemInSession(ConstantsService.LoggedInUserType, ConstantsService.authenticationType.Employee);
      this.baseService.showRootLoader = true;

      const apiRequest = {
        Model: {
          username: ''
        }
      };

      // Get domain details of user
      this.dataService.post(ConstantsService.APIURL.Authentication.GetDomainDetails, apiRequest)
        .subscribe(response => {
          if (response && response.Success && response.Result && !response.Errors) {
            const url = ConstantsService.URL.APP + ConstantsService.URL.HOMEPAGE;
            this.authenticationService.initAdalService(response.Result, url, true);
          } else {
            this.baseService.processApiResponseError(response);
          }
        });
  }

}
