import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ActiontrackerConstantsService } from './actiontracker-constants.service';
import { ConstantsService } from '../../shared/services/constants.service';

@Injectable()
export class ActiontrackerService {

    constructor(
        private dataService: DataService
    ) { }

    // service call to get all the actions by process id
    getActionsByFilters(model, callbackMethod) {
        const requestData = model;
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionsByFilters, requestData)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // service call to submit the action details
    submitActionDetails(model, callbackMethod) {
        const requestData = model;
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.SubmitActionDetails, requestData)
            .subscribe(response => {
                callbackMethod(response);
            });
    }


    // service call to get user details by email or user id
    getUserDetails(model, callbackMethod) {
        this.dataService.post(ConstantsService.APIURL.Common.GetUserByEmailOrId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Uploaded documents
    getUploadedDocumentById(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetUploadedDocumentById, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Status
    getStatusByProcessId(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetStatusByProcessId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Process
    getProcess(callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetProcess)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get action details by ActionId
    getActionDetailsById(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionDetailsById, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Observation data of particular id
    getObservationRequest(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetObservationRequest, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Action data for verifier dashboard
    getActionForVerifierDashboard(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionForVerifierDashboard, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Action data for action owner dashboard
    getActionForActionOwnerDashboard(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionForActionOwnerDashboard, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Action data for Action Party dashboard
    getActionForActionPartyDashboard(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionForActionPartyDashboard, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get observation type by company id
    getObservationTypeByCompanyId(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetObservationTypeByCompanyId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get observation for Action owner
    getObservationDetailForActionOwner(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetObservationDetailForActionOwner, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Assign Action to action part and action verifier
    assignActionToActionOwner(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.ActionAssignByActionOwner, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get action details get model
    getActionGetModelById(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionGetModelById, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // submit verifier action
    submitVerifierAction(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.SubmitVerifierAction, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Assign Action to action part and action verifier
    reassignActionToActionParty(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.ReassignActionToActionParty, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // close action
    closeAction(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.CloseAction, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get action details for risk request by action id
    getActionDetailsForRiskRequestByActionId(model, callbackMethod) {
        this.dataService.post(ActiontrackerConstantsService.ActiontrackerURL.GetActionDetailsForRiskRequestByActionId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }
}
