import { Injectable } from '@angular/core';

import { DataService } from '../../shared/services/data.service';
import { ObservationConstantsService } from '../services/observation-constants.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { MasterscreenConstantsService } from '../../masterscreen/services/masterscreen-constants.service';
@Injectable()
export class ObservationService {

    constructor(private dataService: DataService) { }
    public observationRequestId = 0;
    /**
       * Function to post detalis
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
    // service call to insert observation data
    submitObservationData(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.InsertObservationData, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    updateObservationData(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.UpdateObservationData, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Method to post action details to insert into database.
    insertActionDetails(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.InsertActonDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // service call to get location
    getLocationData(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetLocationDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // service call to get Company
    getCompanyData(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetCompanyDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // service call to get all the employee's and contractor's name whose initial entered
    getSearchResultsForUsers(model, callbackMethod) {
        const requestData = model;
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetUsersOnSearch, requestData)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Observation request for dashboard
    getObservationRequestsForDashboard(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationRequestsForDashboard, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Status
    getStatusByProcessId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetStatusByProcessId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Process
    getProcess(callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetProcess)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    getUserTypes(callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetUserTypes)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Observation data of particular id
    getObservationRequest(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationRequest, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    getUserDetails(model, callbackMethod) {
        this.dataService.post(ConstantsService.APIURL.Common.GetUserByEmailOrId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Cancel Observation request
    cancelObservationRequest(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.CancelObservationRequest, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }


    // close Observation request
    closeObservationRequest(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.CloseObservationRequest, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Acknowledge Observation request
    acknowledgeObservationRequest(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.AcknowledgeObservationRequest, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get selected Id
    getSelectedObservationRequestId(Id) {
        this.observationRequestId = Id;
    }

    // send observation request Id
    sendObservationRequestId() {
        return this.observationRequestId;
    }

    // Get Observation data HSE Advisor
    getObservationRequestForHSEAdvisor(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationRequestForHSEAdvisor, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Observation data for particular id for HSE Advisor
    getObservationForHSEAdvisor(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationForHSEAdvisor, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // delete onservation by HSE Advisor
    deleteObservationByHSEAdvisor(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.DeleteObservationByHSEAdvisor, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to Get Observation type Details by company id.
  * @param model - Model contain api request
  * @param response - response of request.
  */
    getObservationTypeByCompanyId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationTypeByCompanyId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get hazard by company id
    getHazardTypeByCompanyId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetHazardTypeByCompanyId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Observation data By Observation Id
    getObservationRequestByObservationId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationRequestByObservationId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get action by observation id
    getActionsByObservationId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetActionsByObservationId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // Get Temp observation requests for file upload by mobile user
    GetTempObservationRequestForBackOffice(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetTempObservationRequestForBackOffice, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
* Function to Get User Details By Temp Observation ID.
* @param model - Model contain api request
* @param response - response of request.
*/
    GetUserDetailsByTempObservationId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetUserDetailsByTempObservationId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
* Function to Delete Temp Observation Request if image are blur/Empty.
* @param model - Model contain api request
* @param response - response of request.
*/
    deleteObservationRequestByTempObsId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.DeleteObservationRequestByTempObsId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
* Function to submit request and update status as submitted by temp observation id.
* @param model - Model contain api request
* @param response - response of request.
*/
    UpdateTempObservationRequestForBackOffice(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.UpdateTempObservationRequestForBackOffice, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
* Function to Get observation status report.
* @param model - Model contain api request
* @param response - response of request.
*/
    GetObservationStatusReport(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetObservationStatusReport, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    // get action by observation id
    getAllActionByObservationId(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.GetAllActionByObservationId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }
    // get action by observation id
    exportToExcel(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.ExportToExcel, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to Get Observation category Details.
  * @param model - Model contain api request
  * @param response - response of request.
  */
    getObservationCategoryDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getObservationCategoryDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }
    updateHazardType(model, callbackMethod) {
        this.dataService.post(ObservationConstantsService.ObservationCardURL.UpdateHazardType, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }
}
