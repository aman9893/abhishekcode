import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Adal4Service } from 'adal-angular4/adal4.service';
import { ConstantsService } from '../services/constants.service';
import { BaseService } from './base.service';

@Injectable()
export class DataService {

  constructor(private httpClient: HttpClient
    , private adal4Service: Adal4Service
    , private baseService: BaseService) { }

  /**
* Handle Http operation that failed.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
  * Sends Http Post request to server
  * @param _this - this object
  * @param url - Url of API
  * @param data - optional data to be sent to server
  * @param token - Access token for resource API
  */
  private getApiResponse(_this, url, data, token) {

    const httpOptions = {
      headers: null
    };
    const contractorLoginResponse = this.baseService.getItemFromSession(ConstantsService.ContractorLoginResponse);
    let contractorEmail = '';

    if (contractorLoginResponse) {
      contractorEmail = JSON.parse(contractorLoginResponse).Email;
    }
    if (httpOptions.headers == null) {
      httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'X-Adal-User': _this.adal4Service.userInfo.username || '',
        'Contractor-User': contractorEmail
      });
    }
    return _this.httpClient.post(url, data, httpOptions)
      .pipe(
        // tap(_ => console.log('return response on service layer')),
        catchError(_this.handleError('getApiResponse'))
      );
  }


  /**
      * Sends Http Post request to server
      * @param url - Url of API
      * @param data - optional data to be sent to server
      */
  post(url, data = null): Observable<any> {
    const _this = this;
    let resource;
    url = ConstantsService.URL.API + url;
    resource = this.baseService.getResourceForEndpoint(url);
    if (resource) {
      // If logged in user is employee then adal4 token else db token
    const loggedinUserType = this.baseService.getItemFromSession(ConstantsService.LoggedInUserType);
      if (loggedinUserType === ConstantsService.authenticationType.Employee) {
        if (this.adal4Service.userInfo.authenticated) {
          return this.adal4Service.acquireToken(resource)
            .flatMap(function (token) {
              return _this.getApiResponse(_this, url, data, token);
            });
        } else {
          return of('User is not authenticated to make service call');
        }
      } else {
          const contractorLoginResponse = this.baseService.getItemFromSession(ConstantsService.ContractorLoginResponse);
          return _this.getApiResponse(_this, url, data, 'Contractor:' + JSON.parse(contractorLoginResponse).UserToken);
      }
    } else {
      return this.getApiResponse(this, url, data, 'Anonymous');
    }
  }
}
