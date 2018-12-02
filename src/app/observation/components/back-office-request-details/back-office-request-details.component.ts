import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseService } from '../../../shared/services/base.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ObservationService } from '../../services/observation.service';
import { CommonService } from '../../../shared/services/common.service';

import { TempObservationRequest } from '../../model/tempObservationRequest.model';
import { User } from '../../model/user.model';
import { Status } from '../../../actiontracker/model/status.model';

@Component({
  selector: 'app-back-office-request-details',
  templateUrl: './back-office-request-details.component.html',
  styleUrls: ['./back-office-request-details.component.css']
})
export class BackOfficeRequestDetailsComponent implements OnInit {
  loggedInUserJSON: any;
  tempObservationId: number;
  isBackOfficeViewDetailsPage: boolean;
  showImage: boolean = false;
  hideImage: boolean = false;
  tempObservationData: TempObservationRequest[];
  userDetails: User[];
  isDeleteSelected: boolean = false;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  deletionReason: any[];
  deletionRemarks: string;
  selectedReason: string;
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  validationOnReason: boolean = false;

  constructor(private baseService: BaseService,
    private route: ActivatedRoute,
    private observationService: ObservationService,
    private commonService: CommonService) {
    this.isBackOfficeViewDetailsPage = true;
    this.tempObservationData = [];
    this.userDetails = [];
    // Set routeURL and route name
    this.routesFlag = ObservationConstantsService.ObservationNavigation.Routes;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    // By default - radio button is selected
    this.isDeleteSelected = false;
    this.deletionReason = ObservationConstantsService.ReasonForDeletion;
  }

  //#region - Event emit and submit req
  /**
   * Function to Update request and update status as submitted
   * @param event Selected dashboard
   */
  submitRequestforBackOffice() {
    const apiRequest = {
      Model: {
        TempObservationRequestId: this.tempObservationId,
      }
    };
    this.observationService.UpdateTempObservationRequestForBackOffice(apiRequest,
      this.callbackMethodForUpdateTempObsReqForBackOffice.bind(this));
  }

  /**
* Function to get response if request updated successfully
* @param response - response of request.
*/
  callbackMethodForUpdateTempObsReqForBackOffice(response) {
    if (response && response.Success) {
      // after submit on be half - redirect to back office dashboard
      setTimeout(() => {
        this.navigateToBackOfficeDashboard();
      }, 400);
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region - drop down selection
  selectedReasonValue() {
    this.validationOnReason = false;
  }
  //#endregion

  //#region - Section for Pop up
  // OK clicked - navigate to dashboard
  navigateToBackOfficeDashboard() {
    this.baseService.navigateToUrl(ConstantsService.Module.Observation + '/' + ObservationConstantsService.SubRouting.Backofficedashboard);
  }

  // Confiramtaion Message on delete the requests
  checkConfirmationForDeletion() {
    if (this.selectedReason) {
      this.alertType = ConstantsService.Confirm;
      this.confirmMessage = ObservationConstantsService.Message.BackOfficeConfirmationMessage;
    } else {
      this.validationOnReason = true;
    }
  }

  // Funtion to Delete requests on YES clicked
  onYesClickedForConfirmation() {
    // save company details
    this.deleteTempObservationRequests();
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    this.successDetails = '';
    this.errorDetails = '';
  }
  //#endregion

  //#region - Delete section for file upload photos
  /**
     * Function to Delete temp Observation Id if images are blur/Empty.
     */
  deleteTempObservationRequests() {
    this.baseService.showRootLoader = true;
    // Check if Deleted section is selected
    if (this.selectedReason) {
      const apiRequest = {
        Model: {
          TempObservationRequestId: this.tempObservationId,
          DeletionRemarks: this.deletionRemarks,
          DeletionReason: this.selectedReason
        }
      };
      this.observationService.deleteObservationRequestByTempObsId(apiRequest, this.callbackMethodForDeleteTempObservationId.bind(this));
    } else {
      this.validationOnReason = true;
      this.baseService.showRootLoader = false;
    }
  }

  /**
* Function to get response if request deleted successfully
* @param response - response of request.
*/
  callbackMethodForDeleteTempObservationId(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = ObservationConstantsService.Message.BackOfficeRequestDeleted;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region
  /**
* Function to Get User Details By Temp Observation ID.
* @param model - Model contain api request
* @param response - response of request.
*/
  getUserDetailsByTempObservationId() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        TempObservationRequestId: this.tempObservationId
      }
    };
    this.observationService.GetUserDetailsByTempObservationId(apiRequest, this.callbackMethodForGetUserDetailsByObsId.bind(this));
  }

  callbackMethodForGetUserDetailsByObsId(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.tempObservationData = response.Result;
      if (this.tempObservationData.length > 0) {
        // Get unique user details
        this.userDetails = this.tempObservationData[0].UserDetails;
      }
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region- display image on hover of image
  displayImage(event, i) {
    if (0 === i) {
      this.showImage = event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
    } else {
      this.hideImage = event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
    }
  }
  //#endregion

  ngOnInit() {
    const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    // check for existing request
    this.route.params.subscribe(params => {
      this.tempObservationId = +params['tempObservationId'];
    });
    // Get User Details Based on observation Id
    this.getUserDetailsByTempObservationId();
  }
}
