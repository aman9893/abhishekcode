import { Component, OnInit } from '@angular/core';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../../../shared/services/base.service';
import { CommonService } from '../../../shared/services/common.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { ActionAssign } from '../../model/actionAssign.model';
import { User } from '../../model/user.model';
import { Action } from '../../model/action.model';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { ObservationRequest } from '../../../observation/model/observationData.model';
import { Priority } from '../../model/priority.model';
import { SearchText } from '../../../observation/model/searchTexts.model';
import { ObservationService } from '../../../observation/services/observation.service';

@Component({
  selector: 'app-action-owner-action',
  templateUrl: './action-owner-action.component.html',
  styleUrls: ['./action-owner-action.component.css']
})
export class ActionOwnerActionComponent implements OnInit {
  actionId: number;
  userTypes: any;
  prioritys: Priority[];
  sub: any;
  successDetails: string;
  hazards: any;
  observationId: number;
  IsJobStopped: string;
  selectedHazardTypes: number[] = [];
  selectedObservationTypes: number;
  observationType: any;
  loggedInUserJSON: any;
  action = new Action();
  assignAction = new Action();
  user = new User();
  searchTexts: SearchText;
  priority: string;
  userResults: User[] = [];
  selectedActionParty: any;
  selectedActionVerifier: any;
  confirmMessage: string;
  isActionAssigned: boolean = false;
  isActionOwnerAndVerifierSame: boolean;
  actionAssign = new ActionAssign();
  alertType: string;
  observationData = new ObservationRequest();
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  dateFormatDDMMYYYY = '';
  constructor(private hseErrorHandler: HseErrorHandlerService,
    private actiontrackerService: ActiontrackerService,
    private baseService: BaseService,
    private route: ActivatedRoute,
    private commonServices: CommonService,
    private observationService: ObservationService,
    private router: Router) { }

  ngOnInit() {
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.InnerRoutes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession(ActiontrackerConstantsService.ActiontrackerModuleConst.loggedInUser);
    this.prioritys = ActiontrackerConstantsService.Priority.Priority;
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.action.ActionParty = new User();
    this.action.ActionVerifier = new User();
    this.searchTexts = new SearchText();
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.sub = this.route.params.subscribe(params => {
      this.actionId = +params[ActiontrackerConstantsService.ActiontrackerModuleConst.actionId];
    });
    this.actionAssign = new ActionAssign();
    this.getUserTypes();
    this.getObservationTypeByCompanyId();
  }

  // get observation data by observation id
  getObservationDataByObservationId() {
    const apiRequest = {
      Model: {
        ActionId: this.actionId
      }
    };
    this.actiontrackerService.getObservationDetailForActionOwner(apiRequest,
      this.callbackMethodForgetObservationDataByObservationId.bind(this));
  }

  // call back method og get observation data
  callbackMethodForgetObservationDataByObservationId(response) {
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      this.actionAssign = response.Result;
      this.user = this.actionAssign.UserData;
      this.action = this.actionAssign.Action;
      this.selectedActionParty = {
        UserId: this.actionAssign.Action.ActionPartyId,
        FullName: this.actionAssign.Action.ActionParty.FullName
      };
      this.selectedActionVerifier = {
        UserId: this.actionAssign.Action.ActionVerifierId,
        FullName: this.actionAssign.Action.ActionVerifier.FullName
      };
      this.observationData = this.actionAssign.ObservationData;
      this.user.LocationName = response.Result.UserData.Location.LocationName;
      this.setSelectedHazardTypes();
      this.setSelectedObservationTypes();
      this.IsJobStopped = this.actionAssign.ObservationData.IsJobStopped.toString();
      this.prioritys.forEach(priority => {
        if (this.action.Priority === priority.Id) {
          this.priority = priority.Priority;
        }
      });
      if (this.action.Status === ActiontrackerConstantsService.Status.Open) {
        this.isActionAssigned = true;
      }
    }
  }
  // Shows error message when service is not available ( WebAPIs are not in running mode)
  serviceError() {
    this.hseErrorHandler.handleError('Service (WebAPI) is not available or not in running mode');
  }

  // set selecyed hazard type
  setSelectedHazardTypes() {
    for (let index = 0; index < this.actionAssign.ObservationData.HazardType.length; index++) {
      for (let innerindex = 0; innerindex < this.hazards.length; innerindex++) {
        if (this.actionAssign.ObservationData.HazardType[index] === this.hazards[innerindex].HazardId) {
          this.hazards[innerindex].checked = true;
          this.selectedHazardTypes.push(this.hazards[innerindex].HazardId);
        }
      }
    }
  }

  // To set selected observation type
  setSelectedObservationTypes() {
    for (let index = 0; index < this.observationType.length; index++) {
      if (this.actionAssign.ObservationData.ObservationTypeId > 0) {
        if (this.actionAssign.ObservationData.ObservationTypeId === this.observationType[index].ObservationTypeId) {
          this.actionAssign.ObservationData.ObservationType = this.observationType[index].ObservationTypeName;
        }
      }
    }
  }

  //#region- get Observation Type from configuration
  getObservationTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'companyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.actiontrackerService.getObservationTypeByCompanyId(apiRequest, this.callbackMethodForGetObservationTypeDetails.bind(this));
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
    this.getHazardTypeByCompanyId();
  }
  //#endregion

  //#region- get Observation Type from configuration
  getHazardTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'CompanyId': this.loggedInUserJSON.Company.CompanyId
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
    this.getObservationDataByObservationId();
  }

  //#endregion
  // To get Employee(s) and Contractor(s) name
  getUsersOnSearch(event) {
    this.userTypes.forEach(user => {
      if (user.UserType === ActiontrackerConstantsService.ActiontrackerModuleConst.Employee) {
        this.searchTexts.UserTypeId = user.UserTypeId;
      }
    });
    this.searchTexts.FilterTexts = event.query;
    this.searchTexts.CompanyId = this.loggedInUserJSON.Company.CompanyId;
    const apiRequest = {
      Model: this.searchTexts
    };
    this.observationService.getSearchResultsForUsers(apiRequest, this.callbackMethodForGetSearchResultsForUsersData.bind(this));
  }

  // call back method of employee on search
  callbackMethodForGetSearchResultsForUsersData(response) {
    if (response === undefined) {
      this.serviceError();
    }

    if (response.Success) {
      const filtered: any[] = [];
      for (let index = 0; index < response.Result.length; index++) {
        this.user = response.Result[index];
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

  // to submit the action
  submit() {
    this.isActionOwnerAndVerifierSame = false;
    if (this.selectedActionParty && this.selectedActionVerifier) {
      if (this.selectedActionParty.FullName === this.selectedActionVerifier.FullName) {
        this.isActionOwnerAndVerifierSame = true;
      }
    }
    if (this.isActionOwnerAndVerifierSame === false) {
      this.assignAction.ActionId = this.actionId;
      if (this.selectedActionParty) {
        this.assignAction.ActionPartyId = this.selectedActionParty.UserId;
      } else {
        this.assignAction.ActionPartyId = null;
      }
      if (this.selectedActionVerifier) {
        this.assignAction.ActionVerifierId = this.selectedActionVerifier.UserId;
      } else {
        this.assignAction.ActionVerifierId = null;
      }
      this.assignAction.UpdatedBy = this.loggedInUserJSON.UserId;
      const apiRequest = {
        Model: this.assignAction
      };
      this.actiontrackerService.assignActionToActionOwner(apiRequest, this.callbackMethodForAssignAction.bind(this));
    }
  }

  // call back method of submit
  callbackMethodForAssignAction(response) {
    if (response.Result === true) {
      this.successDetails = 'Action details has been saved successfully';
      this.alertType = 'Success';
    }
  }
  onOkClickedForConfirmation() {
    this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
  }
  // back to dashboard
  backToDashboard() {
    if ( this.isActionAssigned === true) {
this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
    } else {
 if (this.selectedActionParty || this.selectedActionVerifier) {
      this.alertType = 'Confirm';
      this.confirmMessage = 'You are going back to dashboard. Information entered by you will not be saved. Do you want to continue? ';
    } 
    }
  }

  // on No click of confirmation
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
  }

  // on YES click of confirmation
  onYesClickedForConfirmation() {
    this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
  }

  // select action owner
  selectActionOwner($event) {
    this.isActionOwnerAndVerifierSame = false;
  }

  // get user type
  getUserTypes() {
    this.observationService.getUserTypes(this.callbackMethodForgetUserTypes.bind(this));
  }

  // call back mathod of get user type
  callbackMethodForgetUserTypes(response) {
    if (response.Error != null) {
      this.hseErrorHandler.handleError(response.Error);
    }

    if (response.Success) {
      this.userTypes = response.Result;
    }
  }
}
