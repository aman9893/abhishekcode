import { Location } from './../../../observation/model/location.model';
import { RaiseRisk, RaiseRiskShowErrorMessages } from './../../model/riskRequest.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RiskService } from './../../services/risk.service';
import { CommonService } from './../../../shared/services/common.service';
import { RiskConstantsService } from './../../services/risk-constants.service';
import { BaseService } from '../../../shared/services/base.service';
import { RaiseRiskAllMaster } from './../../model/raiseRiskAllMaster';
import { RiskRequest } from '../../model/riskRequest.model';
import { ConstantsService } from '../../../shared/services/constants.service';
import { AssignActionPost } from './../../../actiontracker/model/actionDetails.model';
import { SearchText } from './../../../observation/model/searchTexts.model';
import { User } from '../../../observation/model/user.model';


@Component({
  selector: 'app-raise-risk',
  templateUrl: './raise-risk.component.html',
  styleUrls: ['./raise-risk.component.css']
})
export class RaiseRiskComponent implements OnInit {

  constructor(private riskService: RiskService,
    private baseService: BaseService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  loggedInUser = this.baseService.getItemFromSession('loggedInUser');
  loggedInUserJSON = JSON.parse(this.loggedInUser);
  raiseRiskAllMaster = new RaiseRiskAllMaster();
  riskRequest = new RiskRequest();
  pearMaster = [];
  consequenceMaster = [];
  severityMaster = [];
  potentialRiskColor = '';
  residualRiskColor = '';
  actionList: AssignActionPost[];
  actionPost: AssignActionPost;
  searchTexts: SearchText;
  userResults: User[] = [];
  displayErrorMessage: RaiseRiskShowErrorMessages;
  successDetails: string;
  errorDetails: any;
  alertType: string;
  confirmMessage: string;
  isUserHasHSEMemberRole: boolean = false;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  selectedRiskRequestId: number;

  ngOnInit() {
     // Set routeURL and route name for Risk
    this.routesFlag = RiskConstantsService.RiskNavigation.InnerRoutes;
    this.reportRoutes = RiskConstantsService.RiskNavigation.ReportRoutes;
    this.route.params.subscribe(params => {
      this.selectedRiskRequestId = + params['riskId'];
    });
    this.isUserHasHSEMemberRole = this.commonService.isUserHasProvidedRole(ConstantsService.Roles.HSEMember);
    this.pearMaster = RiskConstantsService.Pear;
    this.consequenceMaster = RiskConstantsService.Consequence;
    this.severityMaster = RiskConstantsService.Severity;
    this.displayErrorMessage = new RaiseRiskShowErrorMessages();
    // If user has hse member role then only he can raise risk
    if (this.isUserHasHSEMemberRole) {
      this.getAllMasterForRaiseRisk();
    }
    if (this.selectedRiskRequestId > 0) {
      // Get risk request based on RiskRequestId
      this.getRiskRequestForEdit(this.selectedRiskRequestId);
    }
  }

  getRiskRequestForEdit(riskRequestId) {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        RiskRequestId: this.selectedRiskRequestId
      }
    };
    this.riskService.getRiskRequestForEdit(apiRequest, this.successGetRiskRequestForEdit.bind(this));
  }

  successGetRiskRequestForEdit(response) {
    if (response.Result && response.Result.RiskRequest) {
      this.riskRequest = response.Result.RiskRequest;
      response.Result.ActionDetails.forEach(action => {
        action.TargetDate = new Date(action.TargetDate);
      });
      this.actionList = response.Result.ActionDetails;
      this.getRiskColor('Potential');
      this.getRiskColor('Residual');
    }
    this.baseService.showRootLoader = false;
  }

  getAllMasterForRaiseRisk() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        CompanyId: this.loggedInUserJSON.Company.CompanyId
      }
    };
    this.riskService.getAllMasterForRaiseRisk(apiRequest, this.getAllMasterForRaiseRiskSuccess.bind(this));
  }

  getAllMasterForRaiseRiskSuccess(response) {
    this.baseService.showRootLoader = false;
    this.raiseRiskAllMaster = response.Result;
    // check if new request, if it is, reset form else get that request details from db and assign to riskRequest
    this.resetForm();
  }

  // To get Employee(s) and Contractor(s) name
  getUsersOnSearch(event) {
    this.searchTexts.UserTypeId = 1;
    this.searchTexts.FilterTexts = event.query;
    this.searchTexts.CompanyId = this.loggedInUserJSON.Company.CompanyId;
    const apiRequest = {
      Model: this.searchTexts
    };
    this.riskService.getSearchResultsForUsers(apiRequest, this.callbackMethodForGetSearchResultsForUsersData.bind(this));
  }
  // call back method of employee on search
  callbackMethodForGetSearchResultsForUsersData(response) {
    if (response.Success) {
      const filtered: any[] = [];
      for (let index = 0; index < response.Result.length; index++) {
        filtered.push(response.Result[index]);
      }
      this.userResults = filtered;
    }
  }

  // To get id of selected action owner
  selectActionOwner(event) {
    console.log(event);
  }

  getRiskColor(selectedType) {
    switch (selectedType) {
      case RiskConstantsService.RiskType.Potential:
        this.potentialRiskColor = this.riskService.getRiskColorClass(this.riskRequest.PotentialRiskSeverity,
          this.riskRequest.PotentialRiskLikelihood);
        console.log(this.potentialRiskColor);
        break;
      case RiskConstantsService.RiskType.Residual:
        this.residualRiskColor = this.riskService.getRiskColorClass(this.riskRequest.ResidualRiskSeverity,
          this.riskRequest.ResidualRiskLikelihood);
        break;
    }
  }

  removeActionFromActionList(index) {
    if (this.selectedRiskRequestId === 0 && this.actionList.length > 1) {
      this.actionList.splice(index, 1);
    }
  }

  addAction() {
    if (this.selectedRiskRequestId === 0) {
      this.actionPost = new AssignActionPost();
      this.actionList.push(this.actionPost);
    }
  }

  raiseRisk() {
    if (this.validateForm()) {
      this.baseService.showRootLoader = true;
      this.bindActionOwnerIdToList();
      const raiseRisk = new RaiseRisk();
      raiseRisk.ActionDetails = this.actionList;
      this.riskRequest.RaisedBy = this.loggedInUserJSON.UserId;
      raiseRisk.RiskRequest = this.riskRequest;
      const apiRequest = {
        Model: raiseRisk
      };
      this.riskService.raiseRisk(apiRequest, this.raiseRiskSuccess.bind(this));
    }
  }

  bindActionOwnerIdToList() {
    this.actionList.forEach(action => {
      action.ActionOwnerId = action.ActionOwner.UserId;
    });
  }

  raiseRiskSuccess(response) {
    if (response && response.Success) {
      // reset form fields
      this.resetForm();
      // show success message
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Risk details has been added successfully';
    }
    if (response.Errors !== null) {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
    this.baseService.showRootLoader = false;
  }

  onYesClickedSuccess() {
    this.alertType = '';
    this.successDetails = '';
    // if edit request then redirect to dashboard
    if (this.selectedRiskRequestId > 0) {
      this.router.navigate([RiskConstantsService.RedirectUrls.MyRiskRequest]);
    }
  }

  validateForm() {
    let isFormValid = true;
    if (this.riskRequest.RiskSourceId === 0 ||  this.riskRequest.RiskSourceId.toString() === '0') {
      this.displayErrorMessage.showRiskSourceErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ProjectId === 0 || this.riskRequest.ProjectId.toString() === '0') {
      this.displayErrorMessage.showProjectNameErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.LocationId === 0 || this.riskRequest.LocationId.toString() === '0') {
      this.displayErrorMessage.showLocationErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.RiskTitle.trim() === '') {
      this.displayErrorMessage.showRiskTitleErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.RiskManagementToolId === 0 || this.riskRequest.RiskManagementToolId.toString() === '0') {
      this.displayErrorMessage.showRiskManagementToolErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ActivityLeadingToHazard.trim() === '') {
      this.displayErrorMessage.showActivityLeadingToHazardErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.HazardIdentified.trim() === '') {
      this.displayErrorMessage.showHazardIdentifiedErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ThreatIdentified.trim() === '') {
      this.displayErrorMessage.showThreatIdentifiedErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.Consequences.trim() === '') {
      this.displayErrorMessage.showConsequencesErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.PotentialRiskPear.trim() === '0') {
      this.displayErrorMessage.showPotentialPearErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.PotentialRiskLikelihood.trim() === '0') {
      this.displayErrorMessage.showPotentialConsequencesErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.PotentialRiskSeverity === 0 || this.riskRequest.PotentialRiskSeverity.toString() === '0') {
      this.displayErrorMessage.showPotentialSeverityErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.RiskControlTechniquesId === 0 || this.riskRequest.RiskControlTechniquesId.toString() === '0') {
      this.displayErrorMessage.showControlTechniqueErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ControlMeasure.trim() === '') {
      this.displayErrorMessage.showControlMeasureErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ContengencyPlan.trim() === '') {
      this.displayErrorMessage.showContegencyPlanErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ResidualRiskPear.trim() === '0') {
      this.displayErrorMessage.showResidualPearErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ResidualRiskLikelihood.trim() === '0') {
      this.displayErrorMessage.showResidualConsequenceErrorMessage = true;
      isFormValid = false;
    }
    if (this.riskRequest.ResidualRiskSeverity === 0 || this.riskRequest.ResidualRiskSeverity.toString() === '0') {
      this.displayErrorMessage.showResidualSeverityErrorMessage = true;
      isFormValid = false;
    }
    // Action error messages
    this.actionList.forEach(action => {
      if (action.Action.trim() === '') {
        action.ShowActionErrorMessage = true;
        isFormValid = false;
      }
      if (!action.ActionOwner) {
        action.ShowActionOwnerErrorMessage = true;
        isFormValid = false;
      }
      if (action.Priority === 0) {
        action.ShowPriorityErrorMessage = true;
        isFormValid = false;
      }
      if (!action.TargetDate) {
        action.ShowTargetErrorMessage = true;
        isFormValid = false;
      }
    });
    return isFormValid;
  }

  confirmResetForm() {
    this.alertType = ConstantsService.Confirm;
    this.confirmMessage = 'You have clicked reset button. All information ' +
    'entered by you on this page will be lost. Do you want to reset the form?';
  }

  onYesClickedForConfirmation() {
    this.resetForm();
    this.potentialRiskColor = '';
    this.residualRiskColor = '';
    this.alertType = '';
    this.confirmMessage = '';
  }

  onNoClickedForConfirmation() {
    this.alertType = '';
    this.confirmMessage = '';
  }

  resetForm() {
    this.displayErrorMessage = new RaiseRiskShowErrorMessages();
    this.riskRequest = new RiskRequest();
    this.actionPost = new AssignActionPost();
    this.actionList = [];
    this.actionList.push(this.actionPost);
    this.searchTexts = new SearchText();
  }

  updateRisk() {
    if (this.validateForm()) {
      this.baseService.showRootLoader = true;
      const raiseRisk = new RaiseRisk();
      raiseRisk.RiskRequest = this.riskRequest;
      const apiRequest = {
        Model: raiseRisk
      };
      this.riskService.updateRisk(apiRequest, this.updateRiskSuccess.bind(this));
    }
  }

  updateRiskSuccess(response) {
    if (response && response.Result) {
      // show success message
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Risk details has been updated successfully';
    }
    this.baseService.showRootLoader = false;
  }
}
