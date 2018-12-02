import { Injectable } from '@angular/core';
import { IncidentConstantsService } from '../services/incident-constants-service';
import { DataService } from '../../shared/services/data.service';

@Injectable()
export class IncidentService {

  constructor(private dataService: DataService) { }
  public observationRequestId = 0;
  /**
     * Function to post detalis
     * @param Model - Model to send data to api
     * @param callbackMethod - return the response
     */
  /**
* Function to Get Observation type Details by company id.
* @param model - Model contain api request
* @param response - response of request.
*/
  getIncidentTypeByCompanyId(model, callbackMethod) {
    this.dataService.post(IncidentConstantsService.IncidentURL.GetIncidentTypeByCompanyId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  getIncidentCategoryByCompanyId(model, callbackMethod) {
    this.dataService.post(IncidentConstantsService.IncidentURL.GetIncidentCategoryByCompanyId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  getIncidentDataByIncidentId(model, callbackMethod) {
    this.dataService.post(IncidentConstantsService.IncidentURL.GetIncidentDataByIncidentId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }

  updateIncident(model, callbackMethod) {
    this.dataService.post(IncidentConstantsService.IncidentURL.UpdateIncidentData, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }
  getIncidentColorClass(severity, pear) {
    if (severity && pear) {
      switch (severity) {
        case '1':
        case 1:
          switch (pear) {
            case 'People':
              return 'Slight injury or health effect';
            case 'Environment':
              return 'Slight effect';
            case 'Assets':
              return 'Slight damage';
            case 'Reputation':
              return 'Slight impact';
          }
          break;

        case '2':
        case 2:
          switch (pear) {
            case 'People':
              return 'Minor injury or health effect';
            case 'Environment':
              return 'Minor effect';
            case 'Assets':
              return 'Minor damage';
            case 'Reputation':
              return 'Minor impact';
          }
          break;

        case '3':
        case 3:
          switch (pear) {
            case 'People':
              return 'Moderate injury or health effect';
            case 'Environment':
              return 'Moderate effect';
            case 'Assets':
              return 'Moderate damage';
            case 'Reputation':
              return 'Moderate impact';
          }
          break;

        case '4':
        case 4:
          switch (pear) {
            case 'People':
              return 'Single fatality';
            case 'Environment':
              return 'Major effect';
            case 'Assets':
              return 'Major damage';
            case 'Reputation':
              return 'Major impact';
          }
          break;

        case '5':
        case 5:
          switch (pear) {
            case 'People':
              return 'Multiple fatality';
            case 'Environment':
              return 'Massive effect';
            case 'Assets':
              return 'Massive damage';
            case 'Reputation':
              return 'Massive impact';
          }
          break;
      }
    } else {
      return '';
    }
  }

  /**
       * Function to Get Incident Request by User Id
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
  getIncidentRequestByUserId(model, callbackMethod) {
    this.dataService.post(IncidentConstantsService.IncidentURL.GetIncidentRequestByUserId, model)
      .subscribe(response => {
        callbackMethod(response);
      });
  }
  raiseIncident(model, callbackMethod) {
        this.dataService.post(IncidentConstantsService.IncidentURL.RaiseIncident, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

     /**
       * Function to Get Incident Request by incident request Id
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
      getIncidentRequestByIncidentRequestId(model, callbackMethod) {
      this.dataService.post(IncidentConstantsService.IncidentURL.GetIncidentRequestByIncidentRequestId, model)
        .subscribe(response => {
          callbackMethod(response);
        });
    }

       /**
       * Function to close  request by incident request id
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
      closeRequestByIncidentRequestId(model, callbackMethod) {
        this.dataService.post(IncidentConstantsService.IncidentURL.CloseRequestByIncidentRequestId, model)
          .subscribe(response => {
            callbackMethod(response);
          });
      }
}
