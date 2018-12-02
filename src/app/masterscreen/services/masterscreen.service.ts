import { Injectable } from '@angular/core';

import { DataService } from '../../shared/services/data.service';
import { BaseService } from '../../shared/services/base.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { MasterscreenConstantsService } from '../services/masterscreen-constants.service';

@Injectable()
export class MasterscreenService {
    isAppAdminLoggedIn = false;

    constructor(private dataService: DataService,
        private baseService: BaseService) { }

    /**
        * Function to Save Company Details request.
        * @param model - Model contain Status
        * @param response - response of request.
        */
    saveCompanyDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveCompanyDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

        /**
        * Function to Save Project Details request.
        * @param model - Model contain Project details
        * @param response - response of request.
        */
       saveProjectDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveProjectDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
        }

    /**
        * Function to Save Location Details request.
        * @param model - Model contain Status
        * @param response - response of request.
        */
    saveLocationDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveLocationDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
        * Function to Save Configuration Details request.
        * @param model - Model contain configuration details
        * @param response - response of request.
        */
    saveConfigurationDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveConfigurationDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
   * Function to Get Company Details
   * @param model - Model contain Status
   * @param callbackMethod - return the response
   */
    getCompanyDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getCompanyDetails, model)
            .subscribe(response => {
                callbackMethod(response.Result);
            });
    }

        /**
        * Function to get Project Details request.
        * @param response - response of request.
        */
       getProjectDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getProjectDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
        }

    /**
       * Function to Get All Location Details.
       * @param model - Model contain api request
       * @param response - response of request.
       */
    getLocationDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getLocationDetails, model)
            .subscribe(response => {
                callbackMethod(response.Result);
            });
    }

    /**
       * Function to Save Contractor Details.
       * @param model - Model contain api request
       * @param response - response of request.
       */
    saveContractorDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveContractorDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
     * Function to Save Hazard Details.
     * @param model - Model contain api request
     * @param response - response of request.
     */
    saveHazardDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveHazardDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
       * Function to Get All contractor Details.
       * @param model - Model contain api request
       * @param response - response of request.
       */
    getContractorDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getAllContractors, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
       * Function to delete contractor Details.
       * @param model - Model contain api request
       * @param response - response of request.
       */
    deleteContractorDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.deleteContractorDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
     * Function to delete hazard Details.
     * @param model - Model contain api request
     * @param response - response of request.
     */
    deleteHazardDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.deleteHazardDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
       * Function to Get Hazard Details.
       * @param model - Model contain api request
       * @param response - response of request.
       */
    getHazardDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getHazardDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
   * Function to Save observation type Details.
   * @param model - Model contain api request
   * @param response - response of request.
   */
    saveObservationTypeDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveObservationTypeDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to Save observation category Details.
  * @param model - Model contain api request
  * @param response - response of request.
  */
    saveObservationCategoryDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveObservationCategoryDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
   * Function to Get Observation type Details.
   * @param model - Model contain api request
   * @param response - response of request.
   */
    getObservationTypeDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getObservationTypeDetails, model)
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

    /**
     * Function to delete observation type Details.
     * @param model - Model contain api request
     * @param response - response of request.
     */
    deleteObservationTypeDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.deleteObservationTypeDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
   * Function to delete observation category Details.
   * @param model - Model contain api request
   * @param response - response of request.
   */
    deleteObservationCategoryDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.deleteObservationCategoryDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to get the status of Observation configuration wizard.
  * @param model - Model contain api request
  * @param response - response of request.
  */
    getIsObservationConfigurationCompleted(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getIsObservationConfigurationCompleted, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to check the role for app admin
  */
    checkAppAdminDetails() {
        const loggedInUserJson = JSON.parse(this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser));
        if (loggedInUserJson.UserRoles.length > 0) {
            const roles = loggedInUserJson.UserRoles.find((item) => item.RoleName === ConstantsService.Roles.AppAdminRole);
            if (roles !== undefined && roles.RoleName === ConstantsService.Roles.AppAdminRole) {
                this.isAppAdminLoggedIn = true;
            }
        }
        if (!this.isAppAdminLoggedIn) {
            this.baseService.navigateToUrl(ConstantsService.URL.HOMEPAGE);
        }
    }


    /**
  * Function to check the no of role assigned to user
  * @param model - Model contain api request
  * @param response - response of request.
  */
    checkNoOfRoleAssignedToUser(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getNoOfRoleAssignedToUser, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to Save Role mapping
  * @param model - Model contain api request
  * @param response - response of request.
  */
    saveUserRoleMapping(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.saveUserRoleMapping, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to get User role mapping details
  * @param model - Model contain api request
  * @param response - response of request.
  */
    getUserRoleMappingDetails(callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getUserRoleMappingDetails)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
   * Function to delete User Role Mapping Details.
   * @param model - Model contain api request
   * @param response - response of request.
   */
    deleteUserRoleMappingDetails(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.deleteUserRoleMappingDetails, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
  * Function to get raise request of user id
  * @param model - Model contain api request
  * @param response - response of request.
  */
    getRaiseRequestCountForUserId(model, callbackMethod) {
        this.dataService.post(MasterscreenConstantsService.APIURL.getRaiseRequestCountForUserId, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }
}

