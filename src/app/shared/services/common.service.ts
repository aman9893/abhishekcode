import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { Response } from '@angular/http';

import { ConstantsService } from '../../shared/services/constants.service';
import { BaseService } from './base.service';

@Injectable()
export class CommonService {

    constructor(private dataService: DataService,
        private baseService: BaseService) { }

    /**
    * Function to get employee details.
    * @param model - Model details.
    * @param successMethod - Function to execute on completion.
    */
    getUser(apiRequest, successMethod) {
        // Get domain details of user
        this.dataService.post(ConstantsService.APIURL.Common.GetUserByEmailOrId, apiRequest)
            .subscribe(response => {
                if (response && response.Success && response.Result && !response.Errors) {
                    successMethod(response.Result);
                } else {
                    this.baseService.processApiResponseError(response);
                }
            });
    }

    /**
     * Function to get status list by process name.
     * @param processName - Process Name.
     * @param successMethod - Funtion to return response.
     */
    getStatusListByProcessName(processNameModel, successMethod) {
        // Get status list by process name
        this.dataService.post(ConstantsService.APIURL.Common.GetStatusListByProcessName
            , processNameModel)
            .subscribe(response => {
                if (response && response.Success && response.Result && !response.Errors) {
                    successMethod(response.Result);
                } else {
                    this.baseService.processApiResponseError(response);
                }
            });
    }
    /**
         * Function to call to get all the employee's and contractor's name whose initial entered
         * @param processName - Process Name.
         * @param successMethod - Funtion to return response.
         */
    getSearchResultsForUsers(model, callbackMethod) {
        const requestData = model;
        this.dataService.post('api/common/get/usersOnSearch', requestData)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
         * Function to get all user type
         * @param processName - Process Name.
         * @param successMethod - Funtion to return response.
         */
    getUserTypes(callbackMethod) {
        this.dataService.post('api/common/get/userTypes')
          .subscribe(response => {
            callbackMethod(response);
          });
      }

      /**
         * Function to get all user type
         * @param processName - Process Name.
         * @param successMethod - Funtion to return response.
         */
    getListOfRoleName(callbackMethod) {
        this.dataService.post('api/common/get/listofrolename')
          .subscribe(response => {
            callbackMethod(response);
          });
      }

    /**
        * Function to check if user has particular role
        * @param role - role name.
        */
     isUserHasProvidedRole(role) {
        const loggedInUserJson = JSON.parse(this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser));
        if (loggedInUserJson.UserRoles.length > 0) {
            const userRole = loggedInUserJson.UserRoles.find((item) => item.RoleName === role);
            if (userRole) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
}
