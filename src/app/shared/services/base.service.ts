import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ConstantsService } from './constants.service';

declare var moment: any;

@Injectable()
export class BaseService {

  constructor(private router: Router) { }
  // Common global variables
  public showRootLoader = false;
  public loggedInUserType = '';
  public dateFormatDDMMYYYY = 'dd MMM yyyy';
  public dateFormatDDMMYYYYHHMMSS = 'dd MMM yyyy HH:mm a';

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home, delete
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete'];

  /**
    * Function to get item from session.
    * @param key - Key of item to be fetched
    */
  getItemFromSession(key) {
    return sessionStorage.getItem(key);
  }

  /**
    * Function to set item in session.
    * @param key - Key of item to be stored
    * @param value - Value of item to be stored in string
    */
  setItemInSession(key, value) {
    return sessionStorage.setItem(key, value);
  }

  /**
    * Function to set item in session.
    * @param key - Key of item to be removed
    */
  removeItemFromSession(key) {
    return sessionStorage.removeItem(key);
  }

  /**
   * Function to clear session of current logged in user
   */
  clearSession() {
    sessionStorage.clear();
  }

  /**
  * Function to get resource for endpoint
  * @param endpoint - Endpoint for which resource is to be fetched.
  */
  getResourceForEndpoint(endpoint) {
    // if user specified list of anonymous endpoints, no need to send token to these endpoints, return null.
    if (ConstantsService.ADALCONFIG.ANONYMOUS_ENDPOINTS) {
      const filteredAnonymousEndpoints = ConstantsService.ADALCONFIG.ANONYMOUS_ENDPOINTS.filter(function (element) {
        return -1 < endpoint.indexOf(element);
      });
      if (filteredAnonymousEndpoints && filteredAnonymousEndpoints.length) {
        return null;
      }
    }
    const loggedinUserType = this.getItemFromSession(ConstantsService.LoggedInUserType);

    if (loggedinUserType === ConstantsService.authenticationType.Employee) {
      const sessionConfig = this.getItemFromSession('adal-config');
      if (sessionConfig) {
        const config = JSON.parse(sessionConfig);
        for (const configEndpoint in config.endpoints) {
          if (-1 < endpoint.indexOf(configEndpoint)) {
            return config.endpoints[configEndpoint];
          }
        }
      }
    } else {
      return 'contractor login';
    }

    // if not the app's own backend or not a domain listed in the endpoints structure
    return null;
  }

  /**
    * Function to check valid text enter in fields
    * @param event - Get value of text fields
    * @param regex - Get regular expression based on validation
    */
  checkValidText(event, regex, el) {
    // Allow Backspace, tab, end, home and Delete keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  /**
    * Process error response from API.
    */
  processApiResponseError(response) {
    this.showRootLoader = false;
    console.log(response);
    // Display relevant error message
  }

  /**
 * Function to navigate to url
 * @param: url - URL to navigate
 */
  navigateToUrl(url) {
    this.router.navigateByUrl(url);
  }
}
