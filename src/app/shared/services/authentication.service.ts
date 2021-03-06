
import { Injectable } from '@angular/core';
import { Adal4Service } from 'adal-angular4/adal4.service';

import { ConstantsService } from './constants.service';
import { BaseService } from './base.service';
import { DataService } from './data.service';
import { CommonService } from './common.service';

@Injectable()
export class AuthenticationService {

    private isCallFromLogin;
    private redirectUri;

    constructor(private service: Adal4Service
        , private baseService: BaseService
        , private dataService: DataService
        , private commonService: CommonService) { }

    /**
* Handle authentication callback
* @param isCallFromLogin - Handle call is from Login page
* @param redirectUri - Uri to navigate once handling is complete
*/
    handleAuthenticationCallback(isCallFromLogin, redirectUri) {
        if (this.service) {
            this.service = this.initializeAdal4ServiceFromSession(this.service);
            // Check if the user is authenticated. If not, call the login() method
            if (this.service.userInfo.authenticated) {
                // Set logged in user details in session storage and redirect to source url
                const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
                if (!loggedInUser) {
                    this.setLoggedInUser(redirectUri, isCallFromLogin);
                } else {
                    if (isCallFromLogin) {
                        window.open(redirectUri, '_self');
                    }
                }
            } else {
                if (!isCallFromLogin) {
                    window.open(ConstantsService.URL.APP, '_self');
                }
            }
        }
    }

    /**
    * Initialize ADAL service with response.
    * @param response - Object required for initializing ADAL service.
    * @param redirectUri - Uri to navigate once initialization is complete.
    * @param isCallFromLogin - Handle call is from Login page.
    */
    initAdalService(response, redirectUri, isCallFromLogin) {
        const config = {
            instance: response.Instance,
            tenant: response.TenantName,
            clientId: response.AppClientId,
            endpoints: {},
            anonymousEndpoints: ConstantsService.ADALCONFIG.ANONYMOUS_ENDPOINTS
        };
        //// "URL of hosted API": "Audience from DB of hosted API, this is also called as resource (Application ID)"
        config.endpoints[ConstantsService.URL.API] = response.ApiClientId;
        this.baseService.setItemInSession('adal-config', JSON.stringify(config));
        this.service.init(config);
        // Check if the user is authenticated. If not, call the login() method
        if (this.service.userInfo.authenticated) {
            // Set logged in user details in session storage and redirect to source url
            const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
            if (!loggedInUser) {
                this.setLoggedInUser(redirectUri, isCallFromLogin);
            } else {
                window.open(redirectUri, '_self');
            }
        } else {
            this.service.login();
        }
    }

    /**
    * Function to initialize adal 4 service
    * @param adal4Service - Adal4 service.
    */
    initializeAdal4ServiceFromSession(adal4Service: Adal4Service) {
        const sessionConfig = this.baseService.getItemFromSession('adal-config');
        if (sessionConfig) {
            const config = JSON.parse(sessionConfig);
            adal4Service.init(config);
            // Handle callback if this is a redirect from Azure
            adal4Service.handleWindowCallback();
        }
        return adal4Service;
    }

    /*
    * Function to execute on success of fetching employee details.
    * Then redirect to source url
    */
   employeeSuccess(response) {
        if (response) {
            this.baseService.setItemInSession('loggedInUser', JSON.stringify(response));
            if (this.isCallFromLogin) {
                window.open(this.redirectUri, '_self');
            }
            this.baseService.showRootLoader = false;
        } else {
            this.baseService.processApiResponseError(response);
        }
    }

    /*
    * Function to set logged in user details in session storage
    * Then redirect to source url
    */
    setLoggedInUser(redirectUri, isCallFromLogin = false) {
        this.baseService.showRootLoader = true;
        this.redirectUri = redirectUri;
        this.isCallFromLogin = isCallFromLogin;

        const apiRequest = {
            Model: {
                Email: this.service.userInfo.username,
                UserId: ''
            }
          };
        this.commonService.getUser(apiRequest, this.employeeSuccess.bind(this));
    }

    /*
     * Function to logout current user
     */
    logout() {
        this.service = this.initializeAdal4ServiceFromSession(this.service);
        this.baseService.clearSession();
        this.service.logOut();
    }
}
