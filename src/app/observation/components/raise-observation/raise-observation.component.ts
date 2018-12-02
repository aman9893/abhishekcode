import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ObservationService } from '../../services/observation.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { ObservationRequest } from '../../model/observationData.model';
import { Location } from '../../model/location.model';
import { Company } from '../../model/company.model';
import { Login } from '../../model/login.model';
import { User } from '../../../shared/models/user.model';
import { SearchText } from '../../model/searchTexts.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from './../../../shared/services/constants.service';
import { BaseService } from '../../../shared/services/base.service';
import { Usertypes } from '../../model/usertypes.model';
import { Hazard } from '../../model/hazard.model';
import { ObservationType } from '../../model/observationType.model';
import { FileAttachment } from '../../../shared/models/file-attachment.model';
import { CompanyDetails } from '../../../masterscreen/model/admin-master.model';
import { HazardMaster } from '../../../masterscreen/model/hazard-master.model';

@Component({
  selector: 'app-raise-observation',
  templateUrl: './raise-observation.component.html',
  styleUrls: ['./raise-observation.component.css']
})

export class RaiseObservationComponent implements OnInit {
  loggedInUserJSON: any;
  selectedUser: User;
  selectedUserEmp: User;
  selectedUserContractor: User;
  Button: any = {
    showBackToDashboardButton: false,
    showResetButton: true,
    showBackButton: true,
    showSubmitButton: true,
    showUpdateButton: false
  };
  userResults: User[] = [];
  popupMessage: string;
  refId: number;
  observationCheck: boolean;
  hazardCheck: boolean;
  display: boolean = false;
  value: string;
  observationFor: string;
  observationData: ObservationRequest;
  locations: any[];
  company: any = {};
  login: Login;
  user: User;
  userTypes: Usertypes[] = [];
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  selectedObservationTypes: number;
  selectedHazardTypes: number[] = [];
  isLocationErrorMsg: boolean = false;
  isEmployeeNameErrorMsg: boolean = false;
  isContractorNameErrorMsg: boolean = false;
  isObservationDateErrorMsg: boolean = false;
  isObservationTypeErrorMsg: boolean = false;
  isWhatObserveErrorMsg: boolean = false;
  isWhatYouDidErrorMsg: boolean = false;
  isJobStoppedErrorMsg: boolean = false;
  isHazardErrorMsg: boolean = false;
  isObservationForDisplay: boolean = true;
  validate: boolean = true;
  searchTexts: SearchText;
  observationId: number;
  sub: any;
  hazards: Hazard[];
  observationType: ObservationType[];
  showForSelf: boolean;
  showForEmp: boolean;
  showForContractor: boolean;
  selfObservationDataFlag: boolean;
  onBehalfEmpObservationDataFlag: boolean;
  onBehalfContractorObservationDataFlag: boolean;
  IsJobStopped: string;
  successDetails: string;
  errorDetails: any;
  alertType: string;
  dateTime = new Date();
  isDisplayObservationType: boolean = true;
  isHSEAdvisor: boolean = false;
  accept: string;
  multiple: boolean;
  @Input() isBackOfficeViewDetailsPage: any;
  @Output() submitRequestforBackOffice: EventEmitter<any> = new EventEmitter<any>();
  tempFiles: any[] = [];

  constructor(private observationService: ObservationService,
    private hseErrorHandler: HseErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private baseService: BaseService) {
    this.dateTime.setDate(this.dateTime.getDate());
    // File format accepted and only single file allow at a time
    this.accept = '.jpg,.jpeg,.png,.bmp,.BMP';
    this.multiple = false;
  }

  ngOnInit() {
    // Check if Request come from back office - set default as On Behalf of Employee
    if (this.isBackOfficeViewDetailsPage) {
      this.observationFor = ObservationConstantsService.ObservationCardModuleConst.observationOnBehalfEmployee;
      this.setObservationForEdit(ObservationConstantsService.ObservationCardModuleConst.observationOnBehalfEmployee);
    } else {
      // auto-checked radio button
      this.observationFor = ObservationConstantsService.ObservationCardModuleConst.observationFor;
    }
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    if (this.loggedInUserJSON.UserTypes.UserType === ObservationConstantsService.RequestFor.Contractor) {
      this.isObservationForDisplay = false;
    }
    this.getObservationTypeByCompanyId();
    this.getHazardTypeByCompanyId();
    this.sub = this.route.params.subscribe(params => {
      this.observationId = +params['observationId'];
    });
    this.observationData = new ObservationRequest();
    // Set routeURL and route name
    this.routesFlag = ObservationConstantsService.ObservationNavigation.InnerRoutes;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    if (this.loggedInUserJSON.UserRoles.length !== 0) {
      for (let value = 0; value < this.loggedInUserJSON.UserRoles.length; value++) {
        if (this.loggedInUserJSON.UserRoles[value].RoleName === ObservationConstantsService.ObservationCardModuleConst.HSEAdvisor) {
          this.isHSEAdvisor = true;
        }
      }
    }
    if (this.isHSEAdvisor === false) {
      for (let index = 0; index < this.routesFlag.length; index++) {
        if (this.routesFlag[index].routeName === ObservationConstantsService.ObservationCardModuleConst.ObservationDashboard) {
          this.routesFlag.splice(index, 1);
        } if (this.routesFlag[index].routeName === ObservationConstantsService.ObservationCardModuleConst.Reports) {
          this.routesFlag.splice(index, 1);
        }
      }
    }

    this.login = new Login();
    this.selectedUser = new User();
    this.selectedUserContractor = new User();
    this.selectedUserEmp = new User();
    this.login.CompanyId = this.loggedInUserJSON.Company.CompanyId;
    this.login.ID = this.loggedInUserJSON.UserId;
    this.observationData = new ObservationRequest();
    this.observationData.CompanyId = this.loggedInUserJSON.Company.CompanyId;
    this.IsJobStopped = 'false';
    this.searchTexts = new SearchText();
    this.user = new User();
    this.getcompany();
    this.getLocation();
    this.getUserTypes();
  }

  getUserTypes() {
    this.observationService.getUserTypes(this.callbackMethodForgetUserTypes.bind(this));
  }
  callbackMethodForgetUserTypes(response) {
    if (response.Error != null) {
      this.hseErrorHandler.handleError(response.Error);
    }

    if (response.Success) {
      this.userTypes = response.Result;
    }
  }
  getObservationDataByObservationId() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        ObservationRequestId: this.observationId
      }
    };
    this.observationService.getObservationRequest(apiRequest, this.callbackMethodForgetObservationRequest.bind(this));
  }

  callbackMethodForgetObservationRequest(response) {
    this.baseService.showRootLoader = false;
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      this.observationData = response.Result;
      this.getUserDetails();
      this.getLocation();
      this.observationData.ObservationDate = new Date(this.observationData.ObservationDate);
      this.setSelectedHazardTypes();
      this.setSelectedObservationTypes();
      this.IsJobStopped = this.observationData.IsJobStopped.toString();
      this.Button.showBackButton = false;
      this.Button.showResetButton = false;
      this.Button.showSubmitButton = false;
      this.Button.showBackToDashboardButton = true;
      this.Button.showUpdateButton = true;
      // Set file attachments for all File
      this.observationData.WhatWeCouldDoFiles = this.observationData.WhatWeCouldDoFiles.map(item => {
        return this.getFileAttachmentModel(item);
      });
      this.observationData.WhatYouDidFiles = this.observationData.WhatYouDidFiles.map(item => {
        return this.getFileAttachmentModel(item);
      });
      this.observationData.WhatObservedFiles = this.observationData.WhatObservedFiles.map(item => {
        return this.getFileAttachmentModel(item);
      });
    }
  }

  //#region - Return File object
  getFileAttachmentModel(tempFile) {
    // Adding Temporary File and checking if URL and Content are present
    this.tempFiles = [];
    const fileName = tempFile.FilePath.replace(/^.*[\\\/]/, '');
    const type = 'image' + '/' + fileName.split('.').pop();
    const fileAttachment: any = new FileAttachment();
    fileAttachment.name = fileName;
    fileAttachment.type = type;
    fileAttachment.content = tempFile.Content;
    fileAttachment.objectURL = tempFile.FilePath;
    this.tempFiles.push(fileAttachment);
    return this.tempFiles[0];
  }
  //#endregion

  getUserDetails() {
    const apiRequest = {
      Model: {
        UserId: this.observationData.RaisedFor,
        Email: null
      }
    };
    this.observationService.getUserDetails(apiRequest, this.callbackMethodForgetUserDetails.bind(this));
  }

  callbackMethodForgetUserDetails(response) {
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      let UserType = null;
      this.selectedUser = response.Result;
      if (this.selectedUser.UserTypes.UserTypeId !== null) {
        this.userTypes.forEach(userType => {
          if (userType.UserTypeId === this.selectedUser.UserTypes.UserTypeId) {
            UserType = userType.UserType;
          }
        });
        switch (UserType) {
          case 'Employee': {
            if (this.observationData.RaisedFor === this.loggedInUserJSON.UserId) {
              this.observationFor = ObservationConstantsService.ObservationCardModuleConst.observationFor;
              this.selfObservationDataFlag = true;
            } else {
              this.observationFor = ObservationConstantsService.ObservationCardModuleConst.observationOnBehalfEmployee;
              this.onBehalfEmpObservationDataFlag = true;
              this.selectedUserEmp = this.selectedUser;
            }
            break;
          }
          case 'Contractor': {
            this.observationFor = ObservationConstantsService.ObservationCardModuleConst.ObservationOnBehalfContractor;
            this.onBehalfContractorObservationDataFlag = true;
            this.selectedUserContractor = this.selectedUser;
            break;
          }
          default: {
            this.observationFor = ObservationConstantsService.ObservationCardModuleConst.observationFor;
            this.selfObservationDataFlag = true;
          }
        }
      }
    }
  }

  setSelectedHazardTypes() {
    for (let i = 0; i < this.observationData.HazardTypes.length; i++) {
      for (let j = 0; j < this.hazards.length; j++) {
        if (this.observationData.HazardTypes[i] >= 1) {
          if (this.observationData.HazardTypes[i] === this.hazards[j].HazardId) {
            this.selectedHazardTypes.push(this.hazards[j].HazardId);
            this.hazards[j].Checked = true;
          }
        }
      }
    }
  }

  setSelectedObservationTypes() {
    if (this.observationData.ObservationTypeId > 0) {
      for (let j = 0; j < this.observationType.length; j++) {
        if (this.observationData.ObservationTypeId === this.observationType[j].ObservationTypeId) {
          this.selectedObservationTypes = this.observationType[j].ObservationTypeId;
          this.observationType[j].Checked = true;
        }
      }
    }

  }

  setObservationForEdit(value) {
    switch (value) {
      case 'self': {
        this.showForSelf = true;
        this.showForEmp = false;
        this.showForContractor = false;
        this.onBehalfEmpObservationDataFlag = false;
        this.onBehalfContractorObservationDataFlag = false;
        break;
      }
      case 'onbehalfemp': {
        this.showForSelf = false;
        this.showForEmp = true;
        this.showForContractor = false;
        this.selfObservationDataFlag = false;
        this.onBehalfContractorObservationDataFlag = false;
        this.getUsersOnSearch('');
        break;
      }
      case 'onbehalfcontractor': {
        this.showForSelf = false;
        this.showForEmp = false;
        this.showForContractor = true;
        this.selfObservationDataFlag = false;
        this.onBehalfEmpObservationDataFlag = false;
        this.getUsersOnSearch('');
        break;
      }
    }
  }

  // method to check the validation
  checkValidation() {
    if (this.IsJobStopped === 'true') {
      this.observationData.IsJobStopped = true;
    } else {
      this.observationData.IsJobStopped = false;
    }
    this.validate = true;
    if (this.observationData.ObservationTypes === undefined || this.observationData.ObservationTypes === 0) {
      this.observationData.ObservationTypes = this.selectedObservationTypes;
    }
    this.observationData.HazardTypes = this.selectedHazardTypes;
    if (this.observationFor === ObservationConstantsService.ObservationCardModuleConst.observationOnBehalfEmployee) {
      if (!this.observationData.RaisedFor) {
        this.isEmployeeNameErrorMsg = true;
        this.validate = false;
      }
    }
    if (this.observationFor === ObservationConstantsService.ObservationCardModuleConst.ObservationOnBehalfContractor) {
      if (this.observationData.RaisedFor === null) {
        this.isEmployeeNameErrorMsg = true;
        this.validate = false;
      }
    }
    if (!this.observationData.LocationId) {
      this.isLocationErrorMsg = true;
      this.validate = false;
    } if (!this.observationData.ObservationDate) {
      this.isObservationDateErrorMsg = true;
      this.validate = false;
    } if (this.observationData.ObservationTypes === 0) {
      this.isObservationTypeErrorMsg = true;
      this.validate = false;
    } if (!this.observationData.WhatObserved) {
      this.isWhatObserveErrorMsg = true;
      this.validate = false;
    } if (!this.observationData.WhatYouDid) {
      this.isWhatYouDidErrorMsg = true;
      this.validate = false;
    }
    if (this.company.CompanyName !== ObservationConstantsService.CompanyConst.QAMP) {
      if (this.observationData.ObservationTypes === 0) {
        this.isObservationTypeErrorMsg = true;
        this.validate = false;
      }
      if (this.observationData.HazardTypes.length === 0 && !this.observationData.NotListed) {
        this.isHazardErrorMsg = true;
        this.validate = false;
      }
    }
    if (this.validate === true) {
      this.submitObservationCard();
    }
  }

  setObservationFor() {
    if (this.observationFor === ObservationConstantsService.ObservationCardModuleConst.observationFor) {
      this.observationData.RaisedFor = this.loggedInUserJSON.UserId;
    } else if (this.observationFor === ObservationConstantsService.ObservationCardModuleConst.observationOnBehalfEmployee) {
      this.observationData.RaisedFor = this.selectedUserEmp.UserId;
    } if (this.observationFor === ObservationConstantsService.ObservationCardModuleConst.ObservationOnBehalfContractor) {
      this.observationData.RaisedFor = this.selectedUserContractor.UserId;
    }
  }

  // method to submit the observation card data
  submitObservationCard() {
    this.baseService.showRootLoader = true;
    this.setObservationFor();
    this.observationData.RaisedBy = this.loggedInUserJSON.UserId;
    if (this.observationData) {
      const apiRequest = {
        Model: this.observationData
      };
      if (!isNaN(this.observationId)) {
        apiRequest.Model.ObservationId = this.observationId;
        apiRequest.Model.CompanyId = this.loggedInUserJSON.Company.CompanyId;
        this.observationService.updateObservationData(apiRequest, this.callbackMethodForsubmitObservationData.bind(this));
      } else {
        // Call dummy method to post data
        this.observationService.submitObservationData(apiRequest, this.callbackMethodForsubmitObservationData.bind(this));
      }
    }
  }

  // call back method of submit observation
  callbackMethodForsubmitObservationData(response) {
    this.baseService.showRootLoader = false;
    if (response === undefined) {
      this.serviceError();
    }

    if (response.Success) {
      this.alertType = ConstantsService.Success;
      this.refId = response.Result;
      if (this.observationId) {
        this.successDetails = 'Obervation card has been updated with observation reference Id as' + ' ' + 'OBS' + this.refId;
      } else {
        this.successDetails = 'Obervation card has been created with observation reference Id as' + ' ' + 'OBS' + this.refId;
      }
      this.display = true;
    }

    if (response.Errors !== null) {
      this.alertType = ConstantsService.Error;
      this.errorDetails = 'Something went wrong. Please try again later.';
      this.display = true;
    }
    // if request submit from back office
    if (this.isBackOfficeViewDetailsPage) {
      this.submitRequestforBackOffice.emit();
    }
  }

  callbackMethodForupdateObservationData(response) {
    if (response === undefined) {
      this.serviceError();
    }

    if (response.Success) {
      this.popupMessage = 'Obervation card has been updated for observation reference Id - ';
      this.refId = response.Result;
      this.display = true;
    }

    if (response.Errors !== null) {
      this.hseErrorHandler.handleError(response.Errors);
      this.popupMessage = 'Something went wrong. Please try again later.';
      this.display = true;
    }
  }

  // method to get the location
  getLocation() {
    if (this.login) {
      const apiRequest = {
        Model: this.login
      };
      // Call dummy method to post data
      this.observationService.getLocationData(apiRequest, this.callbackMethodForGetLocationData.bind(this));
    }
  }

  // call back method of get location
  callbackMethodForGetLocationData(response) {
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      this.locations = [];
      const locationDetails = response.Result;
      locationDetails.forEach((location) => {
        this.locations.push(
          {
              'label': location.LocationName,
              'value': location.LocationId
          }
      );
      });

    }
    if (response.Errors !== null) {
      this.alertType = ConstantsService.Error;
      this.errorDetails = 'Location list is empty.';
      this.display = true;
      this.hseErrorHandler.handleError(response.Errors);
    }
  }

  // method to get company name
  getcompany() {
    if (this.login) {
      const apiRequest = {
        Model: this.login
      };
      this.observationService.getCompanyData(apiRequest, this.callbackMethodForgetCompanyData.bind(this));
    }
  }

  // call back method of company name
  callbackMethodForgetCompanyData(response) {
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      this.company = response.Result;
    }
    if (response.Result.CompanyName === ObservationConstantsService.CompanyConst.QAMP) {
      this.isDisplayObservationType = false;
    }

    if (response.Result.CompanyId === 0) {

      console.log('Company Id not found.');
      this.display = true;
    }
  }

  // method to store observation vale
  SubmitCheckedObservationValue(value, event): void {
    if (event.target.checked) {
      this.observationCheck = true;
      this.selectedObservationTypes = value.ObservationTypeId;
      value.Checked = true;
    }
  }

  // method to store hazard value
  SubmitCheckedHazardValue(value, event): void {
    if (event.target.checked) {
      this.hazardCheck = true;
      this.selectedHazardTypes.push(value.HazardId);
      value.Checked = true;
    } else {
      const index = this.selectedHazardTypes.indexOf(value.HazardId);
      if (index > -1) {
        this.selectedHazardTypes.splice(index, 1);
        value.Checked = false;
        if (this.selectedHazardTypes.length === 0) {
          this.hazardCheck = false;
        }
      }
    }
  }

  setUserType() {
    switch (this.observationFor) {
      case ObservationConstantsService.ObservationCardModuleConst.observationOnBehalfEmployee:
        this.userTypes.forEach(userType => {
          if (userType.UserType === 'Employee') {
            this.searchTexts.UserTypeId = userType.UserTypeId;
          }
        });
        break;
      case ObservationConstantsService.ObservationCardModuleConst.ObservationOnBehalfContractor:
        this.userTypes.forEach(userType => {
          if (userType.UserType === 'Contractor') {
            this.searchTexts.UserTypeId = userType.UserTypeId;
          }
        });
        break;
      default:
        this.searchTexts.UserTypeId = 0;
    }
  }

  // method to get Employee's and Contractors name
  getUsersOnSearch(event) {
    this.setUserType();
    if (this.loggedInUserJSON) {
      if (typeof event === 'string' || event instanceof String) {
        this.searchTexts.FilterTexts = '';
      } else {
        this.searchTexts.FilterTexts = event.query;
      }
      this.searchTexts.CompanyId = this.loggedInUserJSON.Company.CompanyId;
      const apiRequest = {
        Model: this.searchTexts
      };
      this.observationService.getSearchResultsForUsers(apiRequest, this.callbackMethodForGetSearchResultsForUsersData.bind(this));
    }
  }

  // call back method of employee on search
  callbackMethodForGetSearchResultsForUsersData(response) {
    if (response === undefined) {
      this.serviceError();
    }

    if (response.Success) {
      const filtered: any[] = [];
      for (let i = 0; i < response.Result.length; i++) {
        this.user = response.Result[i];
        if (this.user.FullName.toLowerCase().indexOf(this.searchTexts.FilterTexts.toLowerCase()) === 0) {
          filtered.push(this.user);
        }
      }
      this.userResults = filtered;
    }

    if (response.Errors !== null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
  }

  // method to get id of selected employee
  selectUser(event) {
    this.observationData.RaisedFor = event.UserId;
  }
  // method to reste the form data
  resetForm() {
    this.observationData = new ObservationRequest();
    this.selectedUserEmp = null;
    this.selectedUserContractor = null;
    this.IsJobStopped = 'false';
    this.selfObservationDataFlag = true;
    for (let index = 0; index < this.hazards.length; index++) {
      if (this.hazards[index].Checked === true) {
        this.hazards[index].Checked = false;
      }
    }
    for (let index = 0; index < this.observationType.length; index++) {
      if (this.observationType[index].Checked === true) {
        this.observationType[index].Checked = false;
      }
    }
    this.user = null;
    this.selectedUserEmp.UserId = null;
  }

  // Shows error message when service is not available ( WebAPIs are not in running mode)
  serviceError() {
    this.hseErrorHandler.handleError('Service (WebAPI) is not available or not in running mode');
  }

  // call when you click on ok of msg popup
  onYesClickedForConfirmation() {
    this.router.navigate([ObservationConstantsService.RoutingURLConstant.MyObservationURL]);
  }

  //#region- get Observation Type from configuration
  getObservationTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'companyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.observationService.getObservationTypeByCompanyId(apiRequest, this.callbackMethodForGetObservationTypeDetails.bind(this));
  }

  /**
* Callback method of observation type details.
* @param response - response of request.
*/
  callbackMethodForGetObservationTypeDetails(response) {
    if (response && response.Success) {
      this.observationType = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region- get Observation Type from configuration
  getHazardTypeByCompanyId() {
    const apiRequest = {
      Model: {
        CompanyId: this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.observationService.getHazardTypeByCompanyId(apiRequest, this.callbackMethodForGetHazardTypeDetails.bind(this));
  }

  /**
* Callback method of observation type details.
* @param response - response of request.
*/
  callbackMethodForGetHazardTypeDetails(response) {
    if (response && response.Success) {
      this.hazards = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
    if (!isNaN(this.observationId)) {
      this.getObservationDataByObservationId();
    }
  }
  //#endregion
}
