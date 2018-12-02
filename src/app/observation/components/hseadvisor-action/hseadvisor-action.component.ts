import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ObservationService } from '../../services/observation.service';
import { UserData } from '../../model/userData.model';
import { Location } from '../../model/location.model';
import { User } from '../../model/user.model';
import { Action } from '../../../actiontracker/model/action.model';
import { ActionDetails } from '../../../actiontracker/model/actionDetails.model';
import { ActionAssignmentHistory } from '../../../actiontracker/model/ActionAssignmentHistory.model';
import { Process } from '../../model/process.model';
import { Status } from '../../model/status.model';
import { ObservationRequest } from '../../model/observationData.model';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { BaseService } from '../../../shared/services/base.service';
import { SearchText } from '../../model/searchTexts.model';
import { JSONP_ERR_WRONG_RESPONSE_TYPE } from '@angular/common/http/src/jsonp';
import { ActionOwnerDAshboard } from './../../../actiontracker/model/actionOwnerDashboard.model';
import { ActiontrackerConstantsService } from './../../../actiontracker/services/actiontracker-constants.service';
import { Priority } from './../../../actiontracker/model/priority.model';

@Component({
    selector: 'app-advisor-action',
    templateUrl: './hseadvisor-action.component.html',
    styleUrls: ['./hseadvisor-action.component.css']
})

export class HSEAdvisorActionComponent implements OnInit {
    actionToAdd: ActionDetails;
    hazardType: string;
    actionList: ActionDetails[];
    actionForActionAssignment: Action;
    actions: ActionOwnerDAshboard[];
    prioritys: Priority[];
    actionAssignmentHistory: ActionAssignmentHistory;
    loggedInUserJSON: any;
    routesFlag: { routeName: string, routeURL: string }[];
    reportRoutes: { routeName: string, routeURL: string }[];
    user: User;
    isAdvisorActiondisplay: boolean = false;
    isObservationStatusdisplay: boolean = true;
    isClosureRemarkErrorMsg: boolean = false;
    isObservationStatusSelected: boolean = false;
    isObservationCategorySelected: boolean = false;
    isRemarkCount: boolean = false;
    userResults: User[] = [];
    sub: any;
    observationId: number;
    display: boolean = false;
    isDeleteSectionDisplay: boolean = false;
    showAddActionSection: boolean = false;
    showReasonToDeleteObsSection: boolean = false;
    showReasonToCloseObsSection: boolean = false;
    showReasonToAcknowledgeObsSection = false;
    isClosureSectionDisplay: boolean = false;
    isActionPerform: boolean = false;
    Id: number;
    dateTime = new Date();
    comment: string;
    searchTexts: SearchText;
    status: string;
    observationStatusList: Status;
    actionStatusList: Status;
    observationData = new ObservationRequest();
    selectedObservationTypes: number;
    hazardCheck: boolean;
    selectedHazardTypes: number[] = [];
    actionListErrorMessages: any = {
        ActionDetails: 'Please provide action details',
        ActionOwner: 'Please select action owner',
        CorrectActionOwner: 'Invalid user',
        CorrectActionParty: 'Invalid user',
        CorrectActionVerifier: 'Invalid user',
        TargetDate: 'Please provide target date',
        Priority: 'Please select priority'
    };
    IsJobStopped: string;
    validate: boolean = true;
    actionEvent: String;
    successDetails: string;
    commentsPopup: boolean = false;
    errorDetails: any;
    alertType: string;
    popupMessage: string;
    confirmMessage: string;
    refId: number;
    processList: Process[] = [];
    observationProcessId: number;
    actionProcessId: number;
    actionStatusId: number;
    observationCloseStatusId: number;
    observationAcknowledgeStatusId: number;
    observationDeleteStatusId: number;
    didYouDoCheck: boolean = false;
    didYouSeeCheck: boolean = false;
    improvedTypeCheck: boolean = false;
    isCloseObservationdisplay: boolean = false;
    hazards: any;
    observationType: any;
    closureReason: string;
    dateFormatDDMMYYYYHHMMSS = '';
    isDeletionreason: boolean = false;
    isClosurereason: boolean = false;
    isAcknowledgereason: boolean = false;
    isActionDeleted: boolean = false;
    observationCategoryList: any[];
    observationCategoryId: number;
    isHSEAdvisor: boolean = false;

    constructor(
        private observationService: ObservationService,
        private router: Router,
        private route: ActivatedRoute,
        private hseErrorHandler: HseErrorHandlerService,
        private baseService: BaseService
    ) {
        this.dateTime.setDate(this.dateTime.getDate());
        this.observationData.ObservationRaiseUser = new User();
        this.observationData.ObservationRaiseUser.ReportingManager = new User();
        this.observationData.ObservationRaiseUser.Location = new Location();
    }

    ngOnInit() {
        const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
        this.loggedInUserJSON = JSON.parse(loggedInUser);
        this.prioritys = ActiontrackerConstantsService.Priority.Priority;
        this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
        this.sub = this.route.params.subscribe(params => {
            this.observationId = +params['observationId'];
        });
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
        this.getProcess();
        this.getObservationCategoryDetails();
        this.searchTexts = new SearchText();
        this.actionList = [];
        this.actionAssignmentHistory = new ActionAssignmentHistory();
        // this.actionToInsert = new Action();
    }

    //#region- Get Observation Category Details
    getObservationCategoryDetails() {
        const apirequest = {
            Model: {
                companyId: this.loggedInUserJSON.Company.CompanyId
            }
        };
        this.observationService.getObservationCategoryDetails(apirequest, this.callbackMethodForGetObservationCategoryDetails.bind(this));
    }

    /**
    * Callback method of observation category details.
    * @param response - response of request.
    */
    callbackMethodForGetObservationCategoryDetails(response) {
        if (response && response.Success) {
            this.observationCategoryList = [];
            const observationCategoryDetailsResponse = response.Result;
            observationCategoryDetailsResponse.forEach((item) => {
                this.observationCategoryList.push(
                    {
                        'label': item.ObservationCategoryName,
                        'value': item.ObservationCategoryId
                    }
                );
            });
        } else {
            this.baseService.processApiResponseError(response);
        }
    }
    //#endregion

    // To perfrom an action on selection of Observation Status
    selectActionToPerform(event) {
        this.observationData.DeletionReason = null;
        this.observationData.ClosureReason = null;
        this.observationData.AcknowledgmentReason = null;
        this.actionList = [];
        this.isRemarkCount = false;
        this.isActionPerform = true;
        this.actionEvent = event;
        this.isObservationStatusSelected = false;
        switch (event) {
            case 'Add Action':
                this.showAddActionSection = true;
                this.showReasonToDeleteObsSection = false;
                this.showReasonToCloseObsSection = false;
                this.showReasonToAcknowledgeObsSection = false;
                this.actionToAdd = new ActionDetails();
                this.actionToAdd.SourceId = this.observationData.ObservationId;
                this.actionToAdd.CreatedBy = this.loggedInUserJSON.UserId;
                this.actionToAdd.Source = this.observationProcessId;
                if (this.actionStatusId) {
                    this.actionToAdd.StatusId = this.actionStatusId;
                }

                this.actionList.push(this.actionToAdd);
                break;
            case 'Delete':
                this.showReasonToDeleteObsSection = true;
                this.showReasonToCloseObsSection = false;
                this.showAddActionSection = false;
                this.showReasonToAcknowledgeObsSection = false;
                break;
            case 'Close':
                this.showReasonToCloseObsSection = true;
                this.showAddActionSection = false;
                this.showReasonToDeleteObsSection = false;
                this.showReasonToAcknowledgeObsSection = false;
                break;
            case 'Acknowledge':
                this.showReasonToAcknowledgeObsSection = true;
                this.showReasonToCloseObsSection = false;
                this.showReasonToDeleteObsSection = false;
                this.showAddActionSection = false;
                break;
            default:
                this.showAddActionSection = false;
                this.showReasonToDeleteObsSection = false;
                this.showReasonToCloseObsSection = false;
        }
    }

    // To add action to action list on click of +Add action
    addAction() {
        this.actionToAdd = new ActionDetails();
        this.actionToAdd.SourceId = this.observationData.ObservationId;
        this.actionToAdd.CreatedBy = this.loggedInUserJSON.UserId;
        this.actionToAdd.Source = this.observationProcessId;
        if (this.actionStatusId) {
            this.actionToAdd.StatusId = this.actionStatusId;
        }
        this.actionList.push(this.actionToAdd);
    }

    removeActionFromActionList(index) {
        this.alertType = ConstantsService.Success;
        this.successDetails = ObservationConstantsService.AcitonCommentConstants.ActionDeleted;
        this.isActionDeleted = true;
        // set const to check action is deleted or not
        if (this.actionList.length > 0) {
            this.actionList.splice(index, 1);
        }
    }

    // To get process
    getProcess() {
        this.observationService.getProcess(this.callbackMethodForgetProcess.bind(this));
    }

    // call back method of get process
    callbackMethodForgetProcess(response) {
        this.processList = response.Result;
        this.processList.forEach(process => {
            if (process.ProcessName === 'Observation') {
                this.getStatusByProcessId(process.ProcessId);
                this.observationProcessId = process.ProcessId;
            }
            if (process.ProcessName === 'Action') {
                this.getStatusByProcessId(process.ProcessId);
                this.actionProcessId = process.ProcessId;
            }
        });
    }

    // To get status
    getStatusByProcessId(processId) {
        const apiRequest = {
            Model: {
                ProcessId: processId
            }
        };
        this.observationService.getStatusByProcessId(apiRequest, this.callbackMethodForgetStatus.bind(this));
    }

    // call back method of submit observation
    callbackMethodForgetStatus(response) {
        if (!response.Result) {
            console.log('No statues');
        }
        if (response.Result.length > 0) {
            response.Result.forEach(status => {
                if (status.ProcessId === this.observationProcessId) {
                    this.observationStatusList = response.Result;
                    if (!this.observationCloseStatusId) {
                        this.observationCloseStatusId = status.StatusName.toLowerCase() === 'closed' ? status.StatusId : undefined;
                    }
                    if (!this.observationAcknowledgeStatusId) {
                        this.observationAcknowledgeStatusId =
                            status.StatusName.toLowerCase() === 'acknowledged' ? status.StatusId : undefined;
                    }
                    if (!this.observationDeleteStatusId) {
                        this.observationDeleteStatusId = status.StatusName.toLowerCase() === 'deleted' ? status.StatusId : undefined;
                    }
                }
                if (status.ProcessId === this.actionProcessId) {
                    this.actionStatusList = response.Result;
                    if (!this.actionStatusId) {
                        this.actionStatusId = status.StatusName.toLowerCase() === 'new' ? status.StatusId : undefined;
                    }
                }
            });
        }
        this.getObservationTypeByCompanyId();
    }

    // To validate the user entered fields.
    validateActionDetails() {
        this.isRemarkCount = false;
        if (this.isActionPerform === false) {
            this.isObservationStatusSelected = true;
            this.isObservationCategorySelected = true;
        } else {
            this.validate = true;
            if (!this.observationCategoryId) {
                this.isObservationCategorySelected = true;
                this.validate = false;
            }
            if (this.actionList.length > 0 && this.showAddActionSection) {
                for (let i = 0; i < this.actionList.length; i++) {
                    if (!this.actionList[i].ActionDetails ||
                        this.actionList[i].ActionDetails === '' ||
                        this.actionList[i].ActionDetails === undefined) {
                        this.actionList[i].displayActionListErrorMessages.ActionDetails = true;
                        this.validate = false;
                    } else {
                        this.actionList[i].displayActionListErrorMessages.ActionDetails = false;
                    }
                    if (this.actionList[i].selectedActionOwner === undefined ||
                        this.actionList[i].selectedActionOwner.toString() === ''
                    ) {
                        this.actionList[i].displayActionListErrorMessages.ActionOwner = true;
                        this.validate = false;
                    } else if (this.actionList[i].selectedActionOwner.UserId === undefined) {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionOwner = true;
                        this.validate = false;
                    } else {
                        this.actionList[i].displayActionListErrorMessages.ActionOwner = false;
                        this.actionList[i].displayActionListErrorMessages.CorrectActionOwner = false;
                    }
                    if (!this.actionList[i].selectedActionParty) {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionParty = false;
                    } else if (this.actionList[i].selectedActionParty.UserId === undefined) {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionParty = true;
                        this.validate = false;
                    } else {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionParty = false;
                    }
                    if (!this.actionList[i].selectedActionVerifier) {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionVerifier = false;
                    } else if (this.actionList[i].selectedActionVerifier.UserId === undefined) {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionVerifier = true;
                        this.validate = false;
                    } else {
                        this.actionList[i].displayActionListErrorMessages.CorrectActionVerifier = false;
                    }
                    if (!this.actionList[i].TargetDate) {
                        this.actionList[i].displayActionListErrorMessages.TargetDate = true;
                        this.validate = false;
                    } else {
                        this.actionList[i].displayActionListErrorMessages.TargetDate = false;
                    }
                    if (!this.actionList[i].Priority || this.actionList[i].Priority === 0) {
                        this.actionList[i].displayActionListErrorMessages.Priority = true;
                        this.validate = false;
                    } else {
                        this.actionList[i].displayActionListErrorMessages.Priority = false;
                    }
                }
            }
            if ((!this.observationData.DeletionReason || !this.observationCategoryId) && this.showReasonToDeleteObsSection) {
                this.isDeletionreason = true;
                this.isObservationCategorySelected = true;
                this.validate = false;
            }
            if ((!this.observationData.ClosureReason || !this.observationCategoryId) && this.showReasonToCloseObsSection) {
                this.isClosurereason = true;
                this.isObservationCategorySelected = true;
                this.validate = false;
            }
            if ((!this.observationData.AcknowledgmentReason || !this.observationCategoryId) && this.showReasonToAcknowledgeObsSection) {
                this.isAcknowledgereason = true;
                this.isObservationCategorySelected = true;
                this.validate = false;
            }
            if (this.validate) {
                if (this.showAddActionSection && this.actionAssignmentHistory !== undefined) {
                    this.alertType = 'Confirm';
                    this.confirmMessage = 'Do you want to submit the details?';
                }
                if (this.showReasonToDeleteObsSection && this.observationData.CancellationReason !== undefined) {
                    this.alertType = 'Confirm';
                    this.confirmMessage = 'Do you want to delete the observation?';
                }
                if (this.showReasonToCloseObsSection && this.observationData.CancellationReason !== undefined) {
                    this.alertType = 'Confirm';
                    this.confirmMessage = 'Do you want to close the observation?';
                }
                if (this.showReasonToAcknowledgeObsSection && this.observationData.CancellationReason !== undefined) {
                    this.alertType = 'Confirm';
                    this.confirmMessage = 'Do you want to Acknowledge the observation?';
                }
            }
        }
    }

    // To delete the observation data
    deleteObservationByHSEAdvisor() {
this.hazardType = this.selectedHazardTypes.join(';').toString();
        const apiRequest = {
            Model: {
                ObservationRequestId: this.observationData.ObservationId,
                Reason: this.observationData.DeletionReason,
                Status: this.observationDeleteStatusId,
                ObservationCategoryId: this.observationCategoryId,
                HazardTypeId: this.hazardType
            }
        };
        this.observationService.deleteObservationByHSEAdvisor(apiRequest, this.callbackMethodForDeleteObservationByHSEAdvisor.bind(this));
    }

    // call back method of delete observation data by HSE Advisor
    callbackMethodForDeleteObservationByHSEAdvisor(response) {
        if (response.Success) {
            this.alertType = ConstantsService.Success;
            if (response.Success) {
                this.successDetails = 'Observation deleted successfully';
            }
            this.display = true;
        }

        if (response.Errors !== null) {
            this.alertType = ConstantsService.Error;
            this.errorDetails = 'Something went wrong. Please try again later.';
            this.display = true;
        }
    }

    // To close the observation data by setting statusid as closed
    closeObservationRequest() {
        this.hazardType = this.selectedHazardTypes.join(';').toString();
        this.observationCategoryId = this.observationData.ObservationCategoryId === 0 ? this.observationCategoryId
        : this.observationData.ObservationCategoryId;

        const apiRequest = {
            Model: {
                ObservationRequestId: this.observationData.ObservationId,
                Reason: this.observationData.ClosureReason,
                Status: this.observationCloseStatusId,
                ObservationCategoryId: this.observationCategoryId,
                HazardTypeId: this.hazardType
            }
        };
        this.observationService.closeObservationRequest(apiRequest, this.callbackMethodForCloseObservationRequest.bind(this));
    }

    // call back method of close observation data
    callbackMethodForCloseObservationRequest(response) {
        if (response.Success) {
            this.alertType = ConstantsService.Success;
            if (response.Success) {
                this.successDetails = 'Observation closed successfully';
            }
            this.display = true;
        }

        if (response.Errors !== null) {
            this.alertType = ConstantsService.Error;
            this.errorDetails = 'Something went wrong. Please try again later.';
            this.display = true;
        }
    }

    //#region - To acknowledge the observation data by setting statusid as acknowledged
    acknowledgeObservationRequest() {
        this.hazardType = this.selectedHazardTypes.join(';').toString();
        const apiRequest = {
            Model: {
                ObservationRequestId: this.observationData.ObservationId,
                Reason: this.observationData.AcknowledgmentReason,
                Status: this.observationAcknowledgeStatusId,
                ObservationCategoryId: this.observationCategoryId,
                HazardTypeId: this.hazardType
            }
        };
        this.observationService.acknowledgeObservationRequest(apiRequest, this.callbackMethodForAcknowledgeObservationRequest.bind(this));
    }

    callbackMethodForAcknowledgeObservationRequest(response) {
        if (response.Success) {
            this.alertType = ConstantsService.Success;
            if (response.Success) {
                this.successDetails = 'Observation acknowledged successfully';
            }
            this.display = true;
        }

        if (response.Errors !== null) {
            this.alertType = ConstantsService.Error;
            this.errorDetails = 'Something went wrong. Please try again later.';
            this.display = true;
        }
    }
    //#endregion - call back method of acknowledge observation data

    // To get Employee(s) and Contractor(s) name
    getUsersOnSearch(event) {
        this.searchTexts.UserTypeId = 1;
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

    // To get id of selected action owner
    selectActionOwner(event) {
        this.actionToAdd.displayActionListErrorMessages.CorrectActionOwner = false;
    }

    // To get id of selected action party
    selectActionParty(event) {
        this.actionToAdd.displayActionListErrorMessages.CorrectActionParty = false;
    }

    // To get id of selected action verifier
    selectActionVerifier(event) {
        this.actionToAdd.displayActionListErrorMessages.CorrectActionVerifier = false;
    }

    // To get observation data by observationrequestid
    getObservationDataByObservationId() {
        const apiRequest = {
            Model: {
                ObservationRequestId: this.observationId
            }
        };
        this.observationService.getObservationRequest(apiRequest, this.callbackMethodForgetObservationRequest.bind(this));
    }

    // call back method of getobservationdatabyobservationid
    callbackMethodForgetObservationRequest(response) {
        if (response === undefined) {
            this.serviceError();
        }
        if (response.Success) {
            this.observationData = response.Result;
            this.observationData.ObservationId = this.observationId;
            this.observationData.ObservationCategoryId = this.observationData.ObservationCategoryId == null ? this.observationCategoryId
            : this.observationData.ObservationCategoryId;
             this.observationData.DisplayId = ObservationConstantsService.
            ObservationCardModuleConst.OBS.concat(this.observationId.toString());
            this.setSelectedHazardTypes();
            this.setSelectedObservationTypes();
            this.IsJobStopped = this.observationData.IsJobStopped.toString();
            if (this.observationData.Status === ObservationConstantsService.Status.Closed) {
                this.isAdvisorActiondisplay = true;
                this.isObservationStatusdisplay = false;
                this.isClosureSectionDisplay = true;
                this.getActionsByObservationId();
            }
            if (this.observationData.Status === ObservationConstantsService.Status.Deleted) {
                this.isAdvisorActiondisplay = false;
                this.isObservationStatusdisplay = false;
                this.isDeleteSectionDisplay = true;
            }
            if (this.observationData.Status === ObservationConstantsService.Status.New) {
                this.getActionsByObservationId();
            }
        }
    }

    // To set selected values checked
    setSelectedHazardTypes() {
        for (let index = 0; index < this.observationData.HazardTypes.length; index++) {
            for (let innerindex = 0; innerindex < this.hazards.length; innerindex++) {
                if (this.observationData.HazardTypes[index] === this.hazards[innerindex].HazardId) {
                    this.hazards[innerindex].checked = true;
                    this.selectedHazardTypes.push(this.hazards[innerindex].HazardId);
                }
            }
        }
    }
    // To set selected observation type
    setSelectedObservationTypes() {
        for (let index = 0; index < this.observationType.length; index++) {
            if (this.observationData.ObservationTypeId > 0) {
                if (this.observationData.ObservationTypeId === this.observationType[index].ObservationTypeId) {
                    this.observationData.ObservationType = this.observationType[index].ObservationTypeName;
                }
            }
        }
    }

    // To store hazard values
    SubmitCheckedHazardValue(value, event): void {
        if (event.target.checked) {
            this.hazardCheck = true;
            this.selectedHazardTypes.push(value.HazardId);
        } else {
            const index = this.selectedHazardTypes.indexOf(value.HazardId);
            if (index > -1) {
                this.selectedHazardTypes.splice(index, 1);
                if (this.selectedHazardTypes.length === 0) {
                    this.hazardCheck = false;
                }
            }
        }
    }

    // Shows error message when service is not available ( WebAPIs are not in running mode)
    serviceError() {
        this.hseErrorHandler.handleError('Service (WebAPI) is not available or not in running mode');
    }

    // To submit the action and observation data
    Submit() {
        if (this.selectedHazardTypes.length > 0) {
             this.hazardType = this.selectedHazardTypes.join(';').toString();
            this.observationData.HazardTypes = this.selectedHazardTypes;
        }
        if (this.observationData) {
            const apiRequest = {
                Model: {
                ObservationRequestId: this.observationData.ObservationId,
                 ObservationCategoryId: this.observationCategoryId,
                HazardTypeId: this.hazardType
                }
            };
           this.observationService.updateHazardType(apiRequest, this.callbackMethodForsubmitObservationData.bind(this));
        }
    }

    // call back method of submit observation
    callbackMethodForsubmitObservationData(response) {
        if (response === undefined) {
            this.serviceError();
        }
        if (response.Success) {
                if (this.actionAssignmentHistory.Actions.length === 0) {
                    for (let i = 0; i < this.actionList.length; i++) {
                        this.actionForActionAssignment = new Action();
                        this.actionForActionAssignment.Source = this.actionList[i].Source;
                        this.actionForActionAssignment.CreatedBy = this.loggedInUserJSON.UserId;
                        this.actionForActionAssignment.ActionOwnerId = this.actionList[i].selectedActionOwner.UserId;
                        if (this.actionList[i].selectedActionParty) {
                            this.actionForActionAssignment.ActionPartyId = this.actionList[i].selectedActionParty.UserId;
                        }
                        if (this.actionList[i].selectedActionVerifier) {
                            this.actionForActionAssignment.ActionVerifierId = this.actionList[i].selectedActionVerifier.UserId;
                        }
                        this.actionForActionAssignment.SourceId = this.actionList[i].SourceId;
                        this.actionForActionAssignment.ActionDetails = this.actionList[i].ActionDetails;
                        this.actionForActionAssignment.Priority = this.actionList[i].Priority;
                        this.actionForActionAssignment.TargetDate = this.actionList[i].TargetDate;
                         this.actionForActionAssignment.Minutes = this.actionList[i].TargetDate.getMinutes();
                          this.actionForActionAssignment.ZoneOffset = this.actionList[i].TargetDate.getTimezoneOffset();
                        this.actionForActionAssignment.StatusId = this.actionList[i].StatusId;
                        this.setActionCommentAndPendingWith();
                        this.actionAssignmentHistory.Actions.push(this.actionForActionAssignment);
                    }
                    this.actionAssignmentHistory.UpdatedBy = this.actionForActionAssignment.CreatedBy;
                    this.actionAssignmentHistory.Remarks = this.actionForActionAssignment.ActionDetails;
                    this.actionAssignmentHistory.StatusId = this.actionForActionAssignment.StatusId;
                }
                if (this.actionAssignmentHistory) {
                    const apiRequest = {
                        Model: this.actionAssignmentHistory
                    };
                    this.observationService.insertActionDetails(apiRequest, this.callbackMethodForInsertActionDetails.bind(this));
                }
        }
        if (response.Errors !== null) {
            this.alertType = ConstantsService.Error;
            this.errorDetails = 'Something went wrong. Please try again later.';
            this.display = true;
        }
    }

    // call back method of submit observation
    callbackMethodForInsertActionDetails(response) {
        if (response === undefined) {
            this.serviceError();
        }

        if (response.Success) {
            this.alertType = ConstantsService.Success;
            if (response.Result === 'Success') {
                this.successDetails = 'Action Saved successfully';
            }
            this.display = true;
        }

        if (response.Errors !== null) {
            this.alertType = ConstantsService.Error;
            this.errorDetails = 'Something went wrong. Please try again later.';
            this.display = true;
        }
    }

    setActionCommentAndPendingWith() {
        if (this.actionForActionAssignment.ActionOwnerId
            && this.actionForActionAssignment.ActionPartyId
            && this.actionForActionAssignment.ActionVerifierId) {
            this.actionAssignmentHistory.Comment =
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionOwner + ' ' +
                this.actionForActionAssignment.ActionOwnerId + '; ' +
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionParty + ' ' +
                this.actionForActionAssignment.ActionPartyId + '; ' +
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionVerifier + ' ' +
                this.actionForActionAssignment.ActionVerifierId + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusFrom + ' '
                + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusTo + ' ' + this.actionForActionAssignment.StatusId;
        } else if (this.actionForActionAssignment.ActionOwnerId
            && this.actionForActionAssignment.ActionPartyId) {
            this.actionAssignmentHistory.Comment =
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionOwner + ' ' +
                this.actionForActionAssignment.ActionOwnerId + '; ' +
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionParty + ' ' +
                this.actionForActionAssignment.ActionPartyId + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusFrom + ' '
                + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusTo + ' ' + this.actionForActionAssignment.StatusId;
        } else if (this.actionForActionAssignment.ActionOwnerId
            && this.actionForActionAssignment.ActionVerifierId) {
            this.actionAssignmentHistory.Comment =
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionOwner + ' ' +
                this.actionForActionAssignment.ActionOwnerId + '; ' +
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionVerifier + ' ' +
                this.actionForActionAssignment.ActionVerifierId + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusFrom + ' '
                + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusTo + ' ' + this.actionForActionAssignment.StatusId;
        } else if (this.actionForActionAssignment.ActionOwnerId) {
            this.actionAssignmentHistory.Comment =
                ObservationConstantsService.AcitonCommentConstants.HSEAdviserToActionOwner + ' ' +
                this.actionForActionAssignment.ActionOwnerId + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusFrom + ' '
                + '; ' + ObservationConstantsService.AcitonCommentConstants.StatusTo + ' ' + this.actionForActionAssignment.StatusId;
        }
        this.actionAssignmentHistory.PendingWith = this.actionForActionAssignment.ActionOwnerId;
    }

    // call when you click on ok of msg popup
    onYesClickedForConfirmation() {
        this.confirmMessage = '';
        this.alertType = '';
        if (this.showAddActionSection && this.actionAssignmentHistory !== undefined) {
            this.Submit();
        }
        if (this.showReasonToDeleteObsSection && this.observationData.CancellationReason !== undefined) {
            this.deleteObservationByHSEAdvisor();
        }
        if (this.showReasonToCloseObsSection && this.observationData.CancellationReason !== undefined) {
            this.closeObservationRequest();
        }
        if (this.showReasonToAcknowledgeObsSection && this.observationData.CancellationReason !== undefined) {
            this.acknowledgeObservationRequest();
        }
    }

    // call when you click on no of msg popup
    onNoClickedForConfirmation() {
        this.confirmMessage = '';
        this.alertType = '';
    }

    onOkClickedOnPopup() {
        this.confirmMessage = '';
        this.alertType = '';
        this.successDetails = '';
        // check - if action part is deleted
        if (!this.isActionDeleted) {
            this.router.navigate([ObservationConstantsService.RoutingURLConstant.ObservationDashboardURL]);
        }
    }

    // display image on hover of div image
    displayImage($event, actionType) {
        if (ObservationConstantsService.ObservationType.didYouSee === actionType) {
            this.didYouSeeCheck = $event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
        } else if (ObservationConstantsService.ObservationType.didYouDo === actionType) {
            this.didYouDoCheck = $event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
        } else if (ObservationConstantsService.ObservationType.improvedType === actionType) {
            this.improvedTypeCheck = $event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
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
        if (!isNaN(this.observationId)) {
            this.getObservationDataByObservationId();
        }
    }
    //#endregion

    // method to get action details by observationId
    getActionsByObservationId() {
        const apiRequest = {
            Model: {
                'ObservationRequestId': this.observationData.ObservationId
            }
        };
        // Get all observation type data
        this.observationService.getActionsByObservationId(apiRequest, this.callbackMethodForgetActionsByObservationId.bind(this));
    }

    /**
  * Callback  method to get action details by observationId
  * @param response - response of request.
  */
    callbackMethodForgetActionsByObservationId(response) {
        if (response && response.Success) {
            this.actions = response.Result;
            if (this.actions.length > 0 && this.observationData.Status === ObservationConstantsService.Status.New) {
                this.isAdvisorActiondisplay = true;
                this.isCloseObservationdisplay = true;
                this.isObservationStatusdisplay = false;
                this.isClosureSectionDisplay = false;
            }
            this.actions.forEach(action => {
                this.prioritys.forEach(priority => {
                    if (action.Priority === priority.Id) {
                        action.PriorityName = priority.Priority;
                    }
                });
            });
        } else {
            this.baseService.processApiResponseError(response);
        }
    }

    // close assigned observation
    closeAssignedObservation() {
        if (!this.observationData.ClosureReason) {
            this.isClosureRemarkErrorMsg = true;
        } else {
            this.closeObservationRequest();
        }
    }
    // Redirect to dashboard with user confirmation
    onClickBackToDashboard() {
        if (this.actionEvent === 'Add Action') {
            for (let index = 0; index < this.actionList.length; index++) {
                if (!this.actionList[index].ActionDetails && !this.actionList[index].CreatedDate && !this.actionList[index].CreatedBy &&
                    !this.actionList[index].ActionPartyId &&
                    !this.actionList[index].ActionVerifierId &&
                    !this.actionList[index].TargetDate &&
                    !this.actionList[index].Priority) {
                    this.router.navigate([ObservationConstantsService.RoutingURLConstant.ObservationDashboardURL]);
                } else {
                    this.alertType = 'Confirm';
                    this.confirmMessage = 'Information entered by you will be lost. Do you  want to go back to dashboard?';
                }
            }
        } else {
            this.router.navigate([ObservationConstantsService.RoutingURLConstant.ObservationDashboardURL]);
        }
    }

    // Reset value of validation for observation category
    resetValidatiionForCategory() {
        this.isObservationCategorySelected = false;
    }

    // close assigned observation
    closeAssigned() {
      this.commentsPopup = true;

    }
}
