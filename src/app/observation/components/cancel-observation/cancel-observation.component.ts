import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ObservationService } from '../../services/observation.service';
import { BaseService } from '../../../shared/services/base.service';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { CommonService } from '../../../shared/services/common.service';

import { ObservationRequest } from '../../model/observationData.model';
import { Hazard } from '../../model/hazard.model';
import { ObservationType } from '../../model/observationType.model';
import { Status } from '../../model/status.model';

@Component({
  selector: 'app-cancel-observation',
  templateUrl: './cancel-observation.component.html',
  styleUrls: ['./cancel-observation.component.css']
})
export class CancelObservationComponent implements OnInit {
  loggedInUserJSON: any;
  observationData: ObservationRequest;
  reason: string;
  companyName: string;
  observationRequestId: number = 0;
  index: number = 0;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  display: boolean = true;
  isJobPosted: string;
  hazards: Hazard[];
  observationType: ObservationType[];
  alertType: string;
  confirmMessage: string;
  successDetails: string;
  statusData: Status;
  // show and hide image popup
  didYouDoCheck: boolean = false;
  didYouSeeCheck: boolean = false;
  improvedTypeCheck: boolean = false;
   isHSEAdvisor: boolean = false;
  constructor(private observationService: ObservationService,
    private baseService: BaseService,
    private commonService: CommonService,
    private route: ActivatedRoute) {
    this.observationData = new ObservationRequest();
    this.statusData = new Status();
  }

  ngOnInit() {
    // this.observationData = new ObservationRequest();
    const loggedInUser = this.baseService.getItemFromSession(ObservationConstantsService.ObservationCardModuleConst.LoggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.companyName = this.loggedInUserJSON.Company.CompanyName;
    this.routesFlag = ObservationConstantsService.ObservationNavigation.Routes;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
   if (this.loggedInUserJSON.UserRoles.length !== 0) {
      for (let value = 0; value < this.loggedInUserJSON.UserRoles.length; value++) {
        if (this.loggedInUserJSON.UserRoles[value].RoleName === ObservationConstantsService.ObservationCardModuleConst.HSEAdvisor) {
          this.isHSEAdvisor = true;
        }
      }
    }
      if (this.isHSEAdvisor === false) {
          for (let index = 0; index < this.routesFlag.length; index++) {
            if (this.routesFlag[index].routeName === ObservationConstantsService.ObservationCardModuleConst.ObservationDashboard) {
              this.routesFlag.splice(index, 1);
            } if (this.routesFlag[index].routeName === ObservationConstantsService.ObservationCardModuleConst.Reports) {
              this.routesFlag.splice(index, 1);
            }
          }
          }
     // check for existing request and  copied into observation id
     this.route.params.subscribe(params => {
      this.observationRequestId = +params['observationId'];
  });
    // this.observationRequestId = this.observationService.sendObservationRequestId();
    this.getObservationTypeByCompanyId();
    this.getHazardTypeByCompanyId();
  }

  // to get observation data
  getObservationData() {
    const apiRequest = {
      Model: {
        ObservationRequestId: this.observationRequestId
      }
    };
    // Call dummy method to post data
    this.observationService.getObservationRequest(apiRequest, this.callbackMethodForGetObservationRequest.bind(this));
  }

  // call back method of observation data
  callbackMethodForGetObservationRequest(response) {
    this.observationData = response.Result;
    for (let index = 0; index < this.observationType.length; index++) {
      if (this.observationData.ObservationTypeId === this.observationType[index].ObservationTypeId) {
        this.observationType[index].Checked = true;
      }
    } for (let index = 0; index < this.observationData.HazardTypes.length; index++) {
      if (this.observationData.HazardTypes[index] !== 0) {
        for (let innerindex = 0; innerindex < this.hazards.length; innerindex++) {
          if (this.observationData.HazardTypes[index] === this.hazards[innerindex].HazardId) {
            this.hazards[innerindex].Checked = true;
          }
        }
      }
    }
    if (this.observationData.IsJobStopped === true) {
      this.isJobPosted = 'true';
    } else {
      this.isJobPosted = 'false';
    }
  }
  // #region - Section for confirmation pop up

  // On click on 'YES' button on confirmation box
  onYesClickedForConfirmation() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        ObservationRequestId: this.observationRequestId,
        Status: ObservationConstantsService.ObservationStatus.Cancelled,
        Reason: this.reason
      }
    };
    this.observationService.cancelObservationRequest(apiRequest, this.callbackMethodForCancelObservationRequest.bind(this));
  }
  // call back method of delete observation data
  callbackMethodForCancelObservationRequest(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = ObservationConstantsService.Message.ObservationCancelledSuccess;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }

  // On click on 'No' button on confirmation box
  onNoClickedForConfirmation() {
    this.alertType = '';
    this.confirmMessage = '';
  }
  // #endregion

  //#region - Navigate to dashboad
  navigateToDashboard() {
    this.baseService.navigateToUrl(ObservationConstantsService.RoutingURLConstant.MyObservationURL);
  }
  //#endregion

  // use to cancel the observation data
  cancelObservationRequest() {
    this.alertType = ConstantsService.Confirm;
    this.confirmMessage = ObservationConstantsService.Message.ObservationCancelledConfirmation;
  }

  //#region- get Observation Type from configuration
  getObservationTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'companyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.observationService.getObservationTypeByCompanyId(apiRequest, this.callbackMethodForGetObservationTypeDetails.bind(this));
  }

  /**
* Callback method of observation type details.
* @param response - response of request.
*/
  callbackMethodForGetObservationTypeDetails(response) {
    if (response && response.Success) {
      this.observationType = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region- get Observation Type from configuration
  getHazardTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'companyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.observationService.getHazardTypeByCompanyId(apiRequest, this.callbackMethodForGetHazardTypeDetails.bind(this));
  }

  /**
* Callback method of observation type details.
* @param response - response of request.
*/
  callbackMethodForGetHazardTypeDetails(response) {
    if (response && response.Success) {
      this.hazards = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.getObservationData();
  }
  //#endregion

  //#region- display image on hover of image
  displayImage($event, actionType) {
    if (ObservationConstantsService.ObservationType.didYouSee === actionType) {
      this.didYouSeeCheck = $event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
    } else if (ObservationConstantsService.ObservationType.didYouDo === actionType) {
      this.didYouDoCheck = $event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
    } else if (ObservationConstantsService.ObservationType.improvedType === actionType) {
      this.improvedTypeCheck = $event.type === ObservationConstantsService.EventType.mouseenter ? true : false;
    }
  }
  //#endregion
}

