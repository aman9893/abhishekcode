import { Component, OnInit } from '@angular/core';
import { Adal4Service } from 'adal-angular4/adal4.service';

import { AuthenticationService } from '../../services/authentication.service';
import { BaseService } from '../../services/base.service';
import { ConstantsService } from '../../services/constants.service';

import { Company } from './../../../observation/model/company.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private isLoginPage = false;
  private isUserLoggedIn = false;
  private loggedinUserType: string = '';
  private loggedInUser: any;
  isDisplaylogobyCompany: boolean;

  constructor(private adal4Service: Adal4Service
    , private authenticationService: AuthenticationService
    , private baseService: BaseService) { }

  ngOnInit() {
    let redirectUri;
    if (window.location.href === ConstantsService.URL.APP) {
      this.isLoginPage = true;
      redirectUri = ConstantsService.URL.APP + ConstantsService.URL.HOMEPAGE;
    } else {
      redirectUri = ConstantsService.URL.APP;
    }

    this.loggedinUserType = this.baseService.getItemFromSession(ConstantsService.LoggedInUserType);
    if (this.loggedinUserType === ConstantsService.authenticationType.Employee) {
      this.authenticationService.handleAuthenticationCallback(this.isLoginPage, redirectUri);
    } else {
      this.baseService.showRootLoader = false;
    }

    const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
    this.loggedInUser = JSON.parse(loggedInUser);
    // if (this.loggedinUserType === null || (this.loggedInUser.Company.CompanyName === ConstantsService.CompanyName.B44)) {
    //   this.isDisplaylogobyCompany = true;

    // } else if (this.loggedInUser.Company.CompanyName === ConstantsService.CompanyName.QAMP) {
    //   this.isDisplaylogobyCompany = false;
    // }
    if (loggedInUser) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
    }
  }

  logout() {
    if (this.loggedinUserType === ConstantsService.authenticationType.Employee) {
      this.authenticationService.logout();
    }
    sessionStorage.clear();
    window.open(ConstantsService.URL.APP, '_self');
  }

}
