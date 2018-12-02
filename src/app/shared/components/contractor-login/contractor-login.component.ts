import { Component, OnInit } from '@angular/core';

import { BaseService } from '../../services/base.service';
import { DataService } from '../..//services/data.service';
import { ConstantsService } from '../../services/constants.service';
import { ContractorLogin } from './../../models/contractor-login';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-contractor-login',
  templateUrl: './contractor-login.component.html',
  styleUrls: ['./contractor-login.component.css']
})
export class ContractorLoginComponent implements OnInit {
  private login: ContractorLogin;
  private isLoginFailed: boolean;
  loggedInUser: any;
  isChangePasswordDisplay: boolean = false;
  isForgotPasswordDisplay: boolean = false;
  isPasswordMatch: boolean = false;
  isPasswordSize: boolean = false;
  isNewPasswordSubmit: boolean = false;
  isConfirmPasswordSubmit: boolean = false;
  isLoginDisplay: boolean = true;
  newPassword: string;
  confirmPassword: string;
  successDetails: string;
  errorDetails: string;
  emailId: string;
  alertType: string;
  constructor(private baseService: BaseService
    , private commonService: CommonService
    , private dataService: DataService,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.login = new ContractorLogin();
    const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
    this.loggedInUser = JSON.parse(loggedInUser);
    if (this.loggedInUser !== null) {
      if (this.loggedInUser.UserTypes.UserType === ConstantsService.authenticationType.Contractor) {
        this.isChangePasswordDisplay = true;
        this.isLoginDisplay = false;
      }
    }
  }

  authenticateContractor() {
    if (this.login.userName && this.login.password) {
      this.baseService.showRootLoader = true;
      this.baseService.setItemInSession(ConstantsService.LoggedInUserType, ConstantsService.authenticationType.Contractor);

      const apiRequest = {
        Model: this.login
      };

      // Authenticate contractor
      this.dataService.post(ConstantsService.APIURL.Authentication.AuthenticateContractor, apiRequest)
        .subscribe(response => {
          if (response && response.Success && response.Result && !response.Errors) {
            const url = ConstantsService.URL.APP + ConstantsService.URL.HOMEPAGE;
            console.log(response.Result);
            this.baseService.setItemInSession(ConstantsService.ContractorLoginResponse, JSON.stringify(response.Result));
            // Get user details
            const request = {
              Model: {
                Email: response.Result.Email,
                UserId: ''
              }
            };
            this.commonService.getUser(request, this.contractorSuccess.bind(this));
          } else {
            this.isLoginFailed = true;
            this.baseService.processApiResponseError(response);
          }
        });
    }
  }

  /*
    * Function to execute on success of fetching contractor details.
    * Then redirect to source url
    */
  contractorSuccess(response) {
    if (response) {
      this.baseService.setItemInSession('loggedInUser', JSON.stringify(response));
      const url = ConstantsService.URL.APP + ConstantsService.URL.HOMEPAGE;
      window.open(url, '_self');
      this.baseService.showRootLoader = false;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }

  // change password
  changePassword() {
    this.isPasswordMatch = false;
    this.isNewPasswordSubmit = false;
    this.isConfirmPasswordSubmit = false;
    this.isPasswordSize = false;
    if (!this.newPassword) {
      this.isNewPasswordSubmit = true;
    } else {
      if (this.newPassword.length > 5) {
        if (!this.confirmPassword) {
          this.isConfirmPasswordSubmit = true;
        } else {
          if (this.newPassword === this.confirmPassword) {
            this.baseService.showRootLoader = true;
            const request = {
              Model: {
                UserId: this.loggedInUser.UserId,
                Password: this.newPassword
              }
            };
            // Authenticate contractor
            this.dataService.post(ConstantsService.APIURL.Common.ChangePassword, request)
              .subscribe(response => {
                if (response.Success === true) {
                  this.alertType = ConstantsService.Success;
                  this.successDetails = 'Your password has been changed successfully! Thank you. You have to re login with new password.';
                  this.baseService.showRootLoader = false;
                }
              });
          } else {
            this.isPasswordMatch = true;
          }
        }
      } else {
        this.isPasswordSize = true;
      }
    }
  }
  // call when you click on ok of msg popup
  onYesClickedForConfirmation() {
    sessionStorage.clear();
    window.open(ConstantsService.URL.APP, '_self');
  }

  // back to home navigate
  backToHome() {
    const url = ConstantsService.URL.HOMEPAGE;
    this.router.navigate([url]);
  }
  // on click forgot password button
  onClickForgotPassword() {
    this.isForgotPasswordDisplay = true;
    this.isLoginDisplay = false;
  }

  // forgot password
  forgotPassword() {
    this.baseService.setItemInSession(ConstantsService.LoggedInUserType, ConstantsService.authenticationType.Contractor);
    const request = {
      Model: {
        Email: this.emailId
      }
    };
    this.dataService.post(ConstantsService.APIURL.Common.ForgetPassword, request)
      .subscribe(response => {
        this.forgotPasswordCallbackMethod(response);
      });
  }
  forgotPasswordCallbackMethod(response) {
    if (response.Success === true) {
      this.alertType = ConstantsService.Success;
      this.successDetails = ('You password is sent to your registered email address {0}.').replace('{0}', this.emailId);
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = 'This email id is not registered with us. You are not a valid user.'
        + 'Kindly enter email id which is registered with us.';
    }
  }
}
