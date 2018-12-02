import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../../../shared/services/base.service';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { Action } from '../../model/action.model';
import { ObservationConstantsService } from '../../../observation/services/observation-constants.service';
import { ActionGet } from '../../model/actionGet';
import { Process } from '../../model/process.model';
import { ObservationRequest } from '../../../observation/model/observationData.model';
import { Status } from '../../model/status.model';
import { UploadedDocument } from '../../model/uploadedDocument.model';
import { ActionAssignmentHistory } from '../../model/ActionAssignmentHistory.model';
import { User } from '../../model/user.model';
import { ReassignAction } from '../../model/reassignACtion.model';
import { ActionHistory } from '../../model/actionHistory.model';
import { SearchText } from '../../../observation/model/searchTexts.model';
import { ObservationService } from '../../../observation/services/observation.service';
import { RiskRequestGet } from '../../../risk/model/riskRequest.model';

// import { FileAttachment } from './../../../shared/models/file-attachment.model';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.css']
})
export class ActionDetailsComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  actionGet: ActionGet;
  actionInfo: Action;
  userTypes: any;
  observtionData: ObservationRequest;
  actionHistoryVerifier: ActionHistory;
  actionHistoryExecuted: ActionHistory;
  actionClosedDetails: ActionHistory;
  actionHistorys: ActionHistory[];
  loggedInUserJSON: any;
  processList: Process[] = [];
  iterableStatusList: Status[] = [];
  status: Status;
  actionVerifier: User;
  actionOwner: User;
  actionParty: User;
  uploadedDoucmentUrls: UploadedDocument;
  actionAssignmentHistory: ActionAssignmentHistory;
  accept: string;
  successDetails: string;
  observationStatus: string;
  userResults: User[] = [];
  errorDetails: string;
  alertType: string;
  display: boolean = false;
  showVerification: boolean = false;
  confirmMessage: string;
  isRemarkErrorMsg: boolean = false;
  showClosureDetails: boolean = false;
  validate: boolean = true;
  selectedActionParty: any;
  verifierRemark: string;
  closeRemark: string;
  ShowCloseRemark: boolean = false;
  showExecutionDetail: boolean = false;
  reassignRemark: string;
  reassignAction: ReassignAction;
  showToReassignAction: boolean = false;
  isObservationStatus: boolean = false;
  user = new User();
  showEnterExecutionDetail: boolean = true;
  ShowReassignmentRemark: boolean = false;
  isReassignRemarkEmpty: boolean = false;
  isCloseRemarkEmpty: boolean = false;
  selectedStatus: string;
  isReassignActionPartyEmpty: boolean = false;
  searchTexts: SearchText;
  dateFormatDDMMYYYY = '';
  toggleImage: boolean = false;
  riskRequestData: RiskRequestGet;
  RiskProcess: string;
  ObservationProcess: string;
  backToDashboardFlag: boolean = false;
  showDashboardbutton: boolean = false;
  showActionParty: Boolean;
  showParty: string;
  constructor(
    private activateRoute: ActivatedRoute,
    private actionTrackerService: ActiontrackerService,
    private hseErrorHandlerService: HseErrorHandlerService,
    private baseService: BaseService,
    private observationService: ObservationService,
    private router: Router
  ) {
    this.showParty = activateRoute.snapshot.params['showParty'];
    this.accept = '.jpg,.png';
    this.RiskProcess = ActiontrackerConstantsService.ActiontrackerModuleConst.Risk;
    this.ObservationProcess = ActiontrackerConstantsService.ActiontrackerModuleConst.Observation;
  }

  ngOnInit() {
    this.baseService.showRootLoader = true;
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.InnerRoutes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.getUserTypes();
    this.actionAssignmentHistory = new ActionAssignmentHistory();
    this.actionInfo = new Action;
    this.observtionData = new ObservationRequest();
    this.riskRequestData = new RiskRequestGet();
    this.actionVerifier = new User();
    this.actionParty = new User();
    this.actionOwner = new User();
    this.actionHistoryVerifier = new ActionHistory();
    this.actionHistoryExecuted = new ActionHistory();
    this.actionClosedDetails = new ActionHistory();
    this.status = new Status();
    this.searchTexts = new SearchText();
    this.reassignAction = new ReassignAction();
    this.actionGet = new ActionGet;
    this.showParty = this.activateRoute.snapshot.params['showParty'];
    this.activateRoute.params.subscribe(params => {
      this.actionInfo.ActionId = +params['actionId'];
    });

    this.getProcess();
  }

  // To get action details by action id
  getActionGetModelById() {
    const apiRequest = {
      Model: {
        ActionId: this.actionInfo.ActionId,
        ProcessId: this.actionAssignmentHistory.ProcessId
      }
    };
    this.actionTrackerService.getActionGetModelById(apiRequest, this.callbackMethodForGetActionGetModelById.bind(this));
  }

  // Need to add this logic to SP side.
  addPendingWithAndComment() {
    this.actionAssignmentHistory.PendingWith = this.actionInfo.ActionVerifier.UserId ?
      this.actionInfo.ActionVerifier.UserId : this.actionInfo.ActionOwner.UserId;
    switch (this.status.StatusName) {
      case ActiontrackerConstantsService.Status.Open:
        this.actionAssignmentHistory.Comment = ConstantsService.AcitonCommentConstants.ActionParty + ' '
          + this.loggedInUserJSON.UserId + '. ' + ConstantsService.AcitonCommentConstants.StatusFrom + ' ' + this.status.StatusId;
        break;
      case ActiontrackerConstantsService.Status.Reopen:
        this.actionAssignmentHistory.Comment = ConstantsService.AcitonCommentConstants.ActionParty + ' '
          + this.loggedInUserJSON.UserId + '. ' + ConstantsService.AcitonCommentConstants.StatusFrom + ' ' + this.status.StatusId;
        break;
    }
  }

  // To get process
  getProcess() {
    this.actionTrackerService.getProcess(this.callbackMethodForgetProcess.bind(this));
  }

  // call back method of get process
  callbackMethodForgetProcess(response) {
    if (response.Error != null) {
      this.hseErrorHandlerService.handleError(response.Error);
    }
    if (response.Success) {
      this.processList = response.Result;
      this.processList.forEach(process => {
        if (process.ProcessName === 'Action') {
          this.actionAssignmentHistory.ProcessId = process.ProcessId;
          this.getActionGetModelById();
          this.getStatusByProcessId(process.ProcessId);
        }
      });
    }
  }

  getUserDetails(AssignedById) {
    const apiRequest = {
      Model: {
        UserId: AssignedById,
        Email: null
      }
    };
    this.actionTrackerService.getUserDetails(apiRequest, this.callbackMethodForgetUserDetails.bind(this));
  }

  callbackMethodForgetUserDetails(response) {
    if (response.Errors != null) {
      this.hseErrorHandlerService.handleError(response.Errors);
    }
    if (response.Success) {
      this.actionInfo.AssignedBy = response.Result.FullName;
    }
  }

  callbackMethodForGetActionGetModelById(response) {
    this.baseService.showRootLoader = false;
    if (response.Error != null) {
      this.hseErrorHandlerService.handleError(response.Error);
    }
    if (response.Success) {
      this.actionInfo = response.Result;
      this.status = response.Result.Status;
      this.getUserDetails(this.actionInfo.CreatedBy);
      this.actionInfo.ActionPriority = this.changePriorityFormat(this.actionInfo.Priority);
      this.observtionData = this.actionInfo.RequestData;
      this.actionVerifier = this.actionInfo.ActionVerifier;
      this.selectedActionParty = this.actionInfo.ActionParty;
      this.actionOwner = this.actionInfo.ActionOwner;
      this.actionHistorys = response.Result.ActionAssignment;
      this.actionInfo.SourceText = this.actionInfo.Process.ProcessName;
      if (this.actionInfo.SourceText === ActiontrackerConstantsService.ActiontrackerModuleConst.Observation) {
this.observtionData.DisplayId = ObservationConstantsService.
            ObservationCardModuleConst.OBS.concat(this.observtionData.ObservationId.toString());
      }
      if (this.actionInfo.Process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Observation) {
        this.observtionData = this.actionInfo.RequestData;
        this.getUploadedDocumentById(this.actionInfo.Process.ProcessId, this.actionInfo.SourceId);
      }
      if (this.actionInfo.Process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Risk) {
        this.riskRequestData = this.actionInfo.RequestData;
      }
      for (let index = 0; index < this.actionHistorys.length; index++) {
        if (this.actionHistorys[index].Status === ActiontrackerConstantsService.Status.Accepted) {
          this.actionHistoryVerifier = this.actionHistorys[index];
        } else if (this.actionHistorys[index].Status === ActiontrackerConstantsService.Status.Done) {
          this.actionHistoryExecuted = this.actionHistorys[index];
        } else if (this.actionHistorys[index].Status === ActiontrackerConstantsService.Status.Closed) {
          this.actionClosedDetails = this.actionHistorys[index];
        }
      }
    }
    if (this.status.StatusName === ActiontrackerConstantsService.Status.Done) {
      this.showEnterExecutionDetail = false;
      this.showExecutionDetail = true;
      this.showToReassignAction = true;
      this.showVerification = false;
      this.showDashboardbutton = true;
      if (this.showParty === 'true') {
        this.showActionParty = true;
      } else {
        this.showActionParty = false;
      }
    }
    if (this.status.StatusName === ActiontrackerConstantsService.Status.Accepted ) {
      this.showExecutionDetail = true;
      this.showEnterExecutionDetail = false;
      this.showVerification = true;
      this.showDashboardbutton = false;


    }
    if (this.status.StatusName === ActiontrackerConstantsService.Status.Closed) {
      this.showEnterExecutionDetail = false;
      this.showExecutionDetail = true;
      this.showVerification = true;
      this.showClosureDetails = true;
      this.showToReassignAction = false;
      this.showDashboardbutton = true;

    }
  }

  // To get status
  getStatusByProcessId(processId) {
    const apiRequest = {
      Model: {
        ProcessId: processId
      }
    };
    this.actionTrackerService.getStatusByProcessId(apiRequest, this.callbackMethodForgetStatus.bind(this));
  }

  // call back method of submit observation
  callbackMethodForgetStatus(response) {
    this.baseService.showRootLoader = false;
    if (response.Errors != null) {
      this.hseErrorHandlerService.handleError(response.Errors);
    }
    if (response.Success) {
      this.iterableStatusList = response.Result;
    }
  }

  getUploadedDocumentById(processId, sourceId) {
    const apiRequest = {
      Model: {
        ProcessId: processId,
        SourceId: sourceId
      }
    };
    this.actionTrackerService.getUploadedDocumentById(apiRequest, this.callbackMethodForgetUploadedDocumentById.bind(this));
  }

  callbackMethodForgetUploadedDocumentById(response) {
    if (response.Errors != null) {
      this.hseErrorHandlerService.handleError(response.Errors);
    }

    if (response.Success) {
      this.uploadedDoucmentUrls = response.Result;
    }
  }
  // Redirect to dashboard with user confirmation
  onClickBackToDashboard() {
    if (!this.actionAssignmentHistory.Remarks && this.actionAssignmentHistory.files.length === 0) {
      this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionTrackerDashboardURL]);
    } else {
      this.alertType = 'Confirm';
      this.confirmMessage = 'Information entered by you will be lost. Do you  want to go back to dashboard?';
    }
  }
  // Submit the aciton details.
  submitActionDetails() {
    this.baseService.showRootLoader = true;
    this.iterableStatusList.forEach(status => {
      if (status.StatusName === 'Done') {
        this.actionAssignmentHistory.StatusId = status.StatusId;
      }
    });
    this.actionAssignmentHistory.ActionId = this.actionInfo.ActionId;
    this.actionAssignmentHistory.UpdatedBy = this.loggedInUserJSON.UserId;
    this.actionAssignmentHistory.UploadedBy = this.loggedInUserJSON.UserId;
    this.actionAssignmentHistory.SourceId = this.actionInfo.SourceId;
    this.addPendingWithAndComment();
    const apiRequest = {
      Model: this.actionAssignmentHistory
    };
    this.actionTrackerService.submitActionDetails(apiRequest, this.callbackMethodForgetsubmitActionDetails.bind(this));
  }

  callbackMethodForgetsubmitActionDetails(response) {
    this.baseService.showRootLoader = false;
    if (response.Errors != null) {
      this.hseErrorHandlerService.handleError(response.Errors);
      this.alertType = ConstantsService.Error;
      this.errorDetails = 'Something went wrong. Please try again later.';
      this.display = true;
    }
    if (response.Success) {
      if (response.Result === 'Success') {
        this.alertType = ConstantsService.Success;
        this.successDetails = 'Action details has been saved successfully.';
        this.display = true;
      }
    }
  }

  // method to check the validation
  checkValidation() {
    if (!this.actionAssignmentHistory.Remarks) {
      this.isRemarkErrorMsg = true;
      this.validate = false;
    } else {
      this.isRemarkErrorMsg = false;
      this.validate = true;
    }
    if (this.validate === true) {
      this.submitActionDetails();
    }
  }

  // return the priority in string format
  changePriorityFormat(priorityToFormat) {
    let strPriority = null;
    switch (priorityToFormat) {
      case 1:
        strPriority = 'High';
        break;
      case 2:
        strPriority = 'Medium';
        break;
      case 3:
        strPriority = 'Low';
        break;
    }
    return strPriority;
  }

  // call when you click on ok of msg popup
  onYesClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    if (this.status.StatusName === ActiontrackerConstantsService.Status.Rejected ||
      this.status.StatusName === ActiontrackerConstantsService.Status.Accepted) {
      this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionTrackerDashboardURL]);
    } else {
      this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
    }
  }

  // call when you click on no of msg popup
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
  }

  onOkClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    if (this.status.StatusName === ActiontrackerConstantsService.Status.Rejected ||
      this.status.StatusName === ActiontrackerConstantsService.Status.Accepted) {
      this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionOwnerDashboardURL]);
    } else {
      this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionPartyDashboardURL]);
    }
  }
  selectActionToPerform(value) {
    this.isObservationStatus = false;
    this.backToDashboardFlag = true;
    this.observationStatus = value;
    if (value === 'Reassign') {
      this.ShowReassignmentRemark = true;
      this.ShowCloseRemark = false;

    } else {
      this.ShowCloseRemark = true;
      this.ShowReassignmentRemark = false;
    }
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
      this.hseErrorHandlerService.handleError(response.Errors);
    }
  }

  // Shows error message when service is not available ( WebAPIs are not in running mode)
  serviceError() {
    this.hseErrorHandlerService.handleError('Service (WebAPI) is not available or not in running mode');
  }

  // get user type
  getUserTypes() {
    this.observationService.getUserTypes(this.callbackMethodForgetUserTypes.bind(this));
  }

  // call back mathod of get user type
  callbackMethodForgetUserTypes(response) {
    if (response.Error != null) {
      this.hseErrorHandlerService.handleError(response.Error);
    }

    if (response.Success) {
      this.userTypes = response.Result;
    }
  }
  submit() {
    this.baseService.showRootLoader = true;
    this.isObservationStatus = false;
    if (!this.observationStatus) {
      this.isObservationStatus = true;
    } else {
      if (this.selectedStatus === ActiontrackerConstantsService.Status.Closed) {
        if (!this.closeRemark) {
          this.isCloseRemarkEmpty = true;
        } else {
          this.reassignAction.ActionId = this.actionInfo.ActionId;
          this.reassignAction.Remarks = this.closeRemark;
          this.reassignAction.UpdatedBy = this.loggedInUserJSON.UserId;
          const apiRequest = {
            Model: this.reassignAction
          };
          this.actionTrackerService.closeAction(apiRequest, this.callbackMethodForCloseAction.bind(this));
        }
      } else {
        if (!this.reassignRemark) {
          this.isReassignRemarkEmpty = true;

        } else if (!this.selectedActionParty.UserId) {
          this.isReassignActionPartyEmpty = true;
        } else {
          this.reassignAction.ActionId = this.actionInfo.ActionId;
          this.reassignAction.ActionPartyId = this.selectedActionParty.UserId;
          this.reassignAction.Remarks = this.reassignRemark;
          this.reassignAction.UpdatedBy = this.loggedInUserJSON.UserId;
          const apiRequest = {
            Model: this.reassignAction
          };
          this.actionTrackerService.reassignActionToActionParty(apiRequest, this.callbackMethodForReAssignAction.bind(this));
        }
      }
    }
    this.baseService.showRootLoader = false;
  }

  // call back method of close action
  callbackMethodForCloseAction(response) {
    if (response.Result === true) {
      this.alertType = ConstantsService.Success;
      this.successDetails = ActiontrackerConstantsService.Message.CloseSuccessMessage;
      this.display = true;
    }
  }
  // call back method of submit
  callbackMethodForReAssignAction(response) {
    this.baseService.showRootLoader = false;
    if (response.Result === true) {
      this.alertType = ConstantsService.Success;
      this.successDetails = ActiontrackerConstantsService.Message.ReassignMessage + this.selectedActionParty.FullName;
      this.display = true;
    }
  }

  // back to dashboard
  backToDashboard() {
    if (!this.backToDashboardFlag) {
      this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionTrackerDashboardURL]);
    } else {
      this.alertType = 'Confirm';
      this.confirmMessage = 'Information entered by you will not be saved. Do you want to continue?';
    }
  }

  //#region- display image on hover of image
  displayImage($event) {
    this.toggleImage = $event.type === 'mouseenter' ? true : false;
  }
  //#endregion
}
