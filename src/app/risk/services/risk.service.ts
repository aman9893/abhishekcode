import { Injectable } from '@angular/core';

import { DataService } from '../../shared/services/data.service';
import { RiskConstantsService } from '../services/risk-constants.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { RaiseRisk } from './../model/riskRequest.model';

@Injectable()
export class RiskService {

  constructor(private dataService: DataService) { }

  /**
     * Function to get all master records required for raise risk
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  // service call to get action trend report data
  getAllMasterForRaiseRisk(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetAllMasterForRiskRaise, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  /**
     * Function to get risk request by id
     * @param Model - Model to send data to api with RiskRequestId
     * @param callbackMethod - return the response
     */
  // service call to get action trend report data
  getRiskRequestById(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetRiskRequestPostEntityById, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  getActionPartyByActionId(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetActionPartyByActionId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }
  /**
     * Function to get risk request by id
     * @param Model - Model to send data to api with RiskRequestId
     * @param callbackMethod - return the response
     */
  // service call to get action trend report data
  getRiskRequestForEdit(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetRiskRequestForEdit, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  // service call to get all the employee's name whose initial entered
  getSearchResultsForUsers(model, callbackMethod) {
    const requestData = model;
    this.dataService.post(ConstantsService.APIURL.Common.GetUsersOnSearch, requestData)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  /**
     * Function to raise risk request
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  // service call to get action trend report data
  raiseRisk(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.RaiseRisk, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  /**
     * Function to update risk request
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  // service call to get action trend report data
  updateRisk(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.UpdateRisk, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  getRiskColorClass(severity, likelihood) {
    if (severity && likelihood) {
      switch (severity) {
        case '1':
        case 1:
          switch (likelihood) {
            case 'A':
            case 'B':
              return 'riskColorGreen';
            case 'C':
            case 'D':
            case 'E':
              return 'riskColorYellow';
          }
          break;

        case '2':
        case 2:
          switch (likelihood) {
            case 'A':
              return 'riskColorGreen';
            case 'B':
            case 'C':
              return 'riskColorYellow';
            case 'D':
            case 'E':
              return 'riskColorOrange';
          }
          break;

        case '3':
        case 3:
          switch (likelihood) {
            case 'A':
            case 'B':
              return 'riskColorYellow';
            case 'C':
            case 'D':
              return 'riskColorOrange';
            case 'E':
              return 'riskColorRed';
          }
          break;

        case '4':
        case 4:
          switch (likelihood) {
            case 'A':
              return 'riskColorYellow';
            case 'B':
            case 'C':
              return 'riskColorOrange';
            case 'D':
            case 'E':
              return 'riskColorRed';
          }
          break;

        case '5':
        case 5:
          switch (likelihood) {
            case 'A':
            case 'B':
              return 'riskColorOrange';
            case 'C':
            case 'D':
            case 'E':
              return 'riskColorRed';
          }
          break;
      }
    } else {
      return '';
    }
  }
  // service call to get risk
  getRiskForDashboard(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetRiskForDashboard, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }
  getAllActionByRiskRequestId(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetAllActionByRiskRequestId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }
  /**
     * Function to get risk request by risk request id
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  getRiskRequestByRiskRequestId(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetRiskRequestByRiskId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  /**
     * Function to update action details for risk by action owner based on action id
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  updateActionDetailsByActionOwnerForRisk(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.UpdateActionDetailsByActionOwnerForRisk, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }
  deleteRiskRequest(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.DeleteRisk, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  /**
     * Function to Get action details by action id
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  GetCompletedActionByRiskId(model, callbackMethod) {
    this.dataService.post(RiskConstantsService.ApiConstants.GetCompletedActionByRiskId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  /**
     * Function to Close Request by risk request id
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
    CloseRiskRequestByRiskId(model, callbackMethod) {
      this.dataService.post(RiskConstantsService.ApiConstants.CloseRiskRequestByRiskId, model)
        .subscribe(response => {
          callbackMethod(response);
        });
    }
}
