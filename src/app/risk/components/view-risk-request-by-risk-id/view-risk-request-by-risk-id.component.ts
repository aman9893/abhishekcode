import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseService } from '../../../shared/services/base.service';
import { RiskService } from '../../services/risk.service';
import { RiskConstantsService } from '../../services/risk-constants.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { CommonService } from '../../../shared/services/common.service';
import { ActiontrackerConstantsService } from '../../../actiontracker/services/actiontracker-constants.service';

import { RiskRequestGet } from '../../model/riskRequest.model';
import { Project, RiskManagementTool, RiskSource, RiskControlTechniques } from '../../model/raiseRiskAllMaster';
import { LocationDetails } from '../../../masterscreen/model/admin-master.model';
import { SearchText } from '../../../observation/model/searchTexts.model';
import { User } from '../../../actiontracker/model/user.model';

@Component({
  selector: 'app-view-risk-request-by-risk-id',
  templateUrl: './view-risk-request-by-risk-id.component.html',
  styleUrls: ['./view-risk-request-by-risk-id.component.css']
})
export class ViewRiskRequestByRiskIdComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  riskRequestDetails: RiskRequestGet;
  alertType: string;
  confirmMessage: string;
  successDetails: string;
  @Input() riskRequestId;
  @Input() backToDashboardFlag;
  @Input() actionDetailsForRisk;
  @Input() priorityName;
  @Input() actionId;
  userTypes: any;
  actionParty: any;
  userFullName: string;
  isDisplay: boolean = true;
  isActionParty: boolean = false;
  searchTexts: SearchText;
  loggedInUserJSON: any;
  user = new User();
  userResults: User[] = [];
  selectedActionParty: any;
  actionPartDesignation: string;
  potentialRiskColor = '';
  residualRiskColor = '';
  validateActionParty: boolean = false;

  constructor(private route: ActivatedRoute,
    private riskService: RiskService,
    private baseService: BaseService,
    private router: Router,
    private commonService: CommonService) {
    this.riskRequestDetails = new RiskRequestGet();
    this.riskRequestDetails.LocationDetails = new LocationDetails();
    this.riskRequestDetails.ProjectDetails = new Project();
    this.riskRequestDetails.RiskManagmentTool = new RiskManagementTool();
    this.riskRequestDetails.RiskSource = new RiskSource();
    this.riskRequestDetails.RiskControlTechniques = new RiskControlTechniques();
    this.searchTexts = new SearchText();
    this.selectedActionParty = null;
  }
  ngOnInit() {
    // Set routeURL and route name for reports and action
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.InnerRoutes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.isDisplay = this.backToDashboardFlag;
    // If user will riskrequestid from query param
    if (!this.riskRequestId) {
      this.route.params.subscribe(params => {
        this.riskRequestId = +params[RiskConstantsService.RiskRequest.RiskRequestId];
      });
    }
    // redirect to action tracker for specific action id
    if (!this.actionId) {
      this.route.params.subscribe(params => {
        this.actionId = +params[ActiontrackerConstantsService.ActiontrackerModuleConst.actionId];
      });
    }
    // Get Risk Request based on Action Id
    this.getRiskRequestByRiskRequestId();
    // Get User Type
    this.getUserTypes();
  }

  //#region - Get Risk Requests by Risk id
  getRiskRequestByRiskRequestId() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        RiskRequestId: this.riskRequestId
      }
    };
    this.riskService.getRiskRequestByRiskRequestId(apiRequest,
      this.callbackRiskRequestByRiskRequestId.bind(this));
  }
  //#region - Get Risk Requests by Risk id
  getActionPartyByActionId() {
    const apiRequest = {
      Model: {
        ActionId: this.actionId
      }
    };
    this.riskService.getActionPartyByActionId(apiRequest,
      this.callbackgetActionPartyByActionId.bind(this));
  }

  callbackgetActionPartyByActionId(response) {
this.actionParty = response.Result;
if (this.actionParty.Status === 'Open') {
  this.actionPartDesignation = this.actionParty.ActionParty.Designation;
  this.selectedActionParty = this.actionParty.ActionParty;
this.isDisplay =  false;
this.isActionParty = true;
}
  }
  callbackRiskRequestByRiskRequestId(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Result && response.Success) {
      this.riskRequestDetails = response.Result;
      // Get Color of Risk for Potential RiskColor and residual RiskColor
      this.potentialRiskColor = this.riskService.getRiskColorClass((this.riskRequestDetails.PotentialRiskSeverity).toString(),
        this.riskRequestDetails.PotentialRiskLikelihood);
      this.residualRiskColor = this.riskService.getRiskColorClass((this.riskRequestDetails.ResidualRiskSeverity).toString(),
        this.riskRequestDetails.ResidualRiskLikelihood);
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.getActionPartyByActionId();
     }
  //#endregion

  //#region - back to action owner dashboard
  backToDashboard() {
    if (this.backToDashboardFlag) {
      if ( this.isActionParty === true) {
        this.router.navigate([RiskConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
      } else {
        this.alertType = ConstantsService.Confirm;
        this.confirmMessage = RiskConstantsService.Alert.ConfirmationMessage;
      }

    } else {
      this.router.navigate([RiskConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
    }
  }

  // Navigate to Dashboard
  onYesClickedForConfirmation() {
    this.router.navigate([RiskConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
  }

  // Not Navigate on No click
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
  }

  // redirect to dashboard
  onYesClickedForSuccess() {
    this.router.navigate([RiskConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
  }

  //#endregion

  //#region - people picker to get Employee(s)
  getUsersOnSearch(event) {
    this.userTypes.forEach(user => {
      if (user.UserType === 'Employee') {
        this.searchTexts.UserTypeId = user.UserTypeId;
      }
    });
    this.searchTexts.FilterTexts = event.query;
    this.searchTexts.CompanyId = this.loggedInUserJSON.Company.CompanyId;
    const apiRequest = {
      Model: this.searchTexts
    };
    this.commonService.getSearchResultsForUsers(apiRequest, this.callbackMethodForGetSearchResultsForUsersData.bind(this));
  }

  // call back method of employee on search
  callbackMethodForGetSearchResultsForUsersData(response) {
    if (response && response.Success) {
      const filtered: any[] = [];
      for (let index = 0; index < response.Result.length; index++) {
        this.user = response.Result[index];
        if (this.user.FullName.toLowerCase().indexOf(this.searchTexts.FilterTexts.toLowerCase()) === 0) {
          filtered.push(this.user);
        }
      }
      this.userResults = filtered;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }

  // To get id of selected action party
  SelectedActionParty(event) {
    if (event) {
      this.actionDetailsForRisk.ActionParty = {
        UserId: event.UserId,
        FullName: event.FullName
      };
      this.actionPartDesignation = event.Designation;
      this.validateActionParty = false;
    }
  }
  //#endregion

  //#region - To get All User type
  getUserTypes() {
    this.baseService.showRootLoader = true;
    this.commonService.getUserTypes(this.callbackMethodForGetUserTypes.bind(this));
  }

  // call back mathod of get user type
  callbackMethodForGetUserTypes(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.userTypes = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion - end get all user type

  //#region - Submit action against action id for risk request
  /**
       * Submit action details for risk request
       */
  submitActionDetailsByActionOwnerForRisk() {
    if (this.selectedActionParty) {
      this.baseService.showRootLoader = true;
      this.actionDetailsForRisk.actionid = this.actionId;
      const apiRequest = {
        Model: this.actionDetailsForRisk
      };
      this.riskService.updateActionDetailsByActionOwnerForRisk(apiRequest, this.callbackMethodUpdateActionDetailsForRisk.bind(this));
    } else {
      this.validateActionParty = true;
    }
  }

  callbackMethodUpdateActionDetailsForRisk(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Result) {
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Action details has been assigned to' + ' ' + 'HseUser' + this.actionDetailsForRisk.ActionParty.UserId;
    }
  }
  //#endregion
}
