import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ObservationService } from '../../services/observation.service';
import { BaseService } from '../../../shared/services/base.service';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { CommonService } from '../../../shared/services/common.service';

import { ObservationType } from '../../model/observationType.model';
import { Hazard } from '../../model/hazard.model';
import { ObservationRequest, ViewRequestForObservation } from '../../model/observationData.model';
import { User } from '../../model/user.model';
import { ActionGet } from '../../../actiontracker/model/actionGet';
import { ObservationCategoryModel } from '../../../masterscreen/model/observation-category.model';

@Component({
    selector: 'app-view-requests-details',
    templateUrl: './view-requests-details.component.html',
    styleUrls: ['./view-requests-details.component.css']
})
export class ViewRequestsDetailsComponent implements OnInit {
    loggedInUserJSON: any;
    observationData: ViewRequestForObservation;
    observationType: ObservationType[];
    hazards: Hazard[];
    raiseFor: User;
    raiseBy: User;
    isShowOnBehalfDetails: boolean = false;
    reportingTo: User;
    routesFlag: { routeName: string, routeURL: string }[];
    reportRoutes: { routeName: string, routeURL: string }[];
    apiRequest: any;
    observationId: number;
    // show and hide image popup
    didYouDoCheck: boolean = false;
    didYouSeeCheck: boolean = false;
    improvedTypeCheck: boolean = false;
    dateFormatDDMMYYYYHHMMSS = '';

    constructor(private baseService: BaseService,
        private commonService: CommonService,
        private observationService: ObservationService,
        private route: ActivatedRoute) {
        this.raiseBy = new User();
         this.reportingTo = new User();
        this.observationData = new ViewRequestForObservation();
        this.observationData.ObservationRequests = new ObservationRequest();
        this.observationData.HseAdviserUsersDetails = new User();
        this.observationData.ActionRequests = new ActionGet();
        this.observationData.ObservationCategoryDetails = new ObservationCategoryModel();
        // Set routeURL and route name
        this.routesFlag = ObservationConstantsService.ObservationNavigation.InnerRoutes;
        this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    }

    //#region - ng oninit start part
    ngOnInit() {
        // initialisation of date format
        this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
        const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
        this.loggedInUserJSON = JSON.parse(loggedInUser);
        // check for existing request
        this.route.params.subscribe(params => {
            this.observationId = +params['observationId'];
        });
        // create Model for companyId
        this.apiRequest = {
            Model: {
                CompanyId: this.loggedInUserJSON.Company.CompanyId
            }
        };
        // Get Observation Type by Company Id
        this.getObservationTypeByCompanyId(this.apiRequest);
    }

    //#region - Get ObservationType By company Id
    getObservationTypeByCompanyId(apiRequest) {
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
        // Get Hazard Details By Company Id
        this.getHazardTypeByCompanyId(this.apiRequest);
    }
    //#endregion

    //#region - Get Hazard Details By Company companyId
    getHazardTypeByCompanyId(apiRequest) {
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
        // Get Observation Data by Observation request Id
        this.getObservationDataByObservationId();
    }
    //#endregion

    //#region - Get Observation Data By observation Id
    getObservationDataByObservationId() {
        const apiRequest = {
            Model: {
                ObservationRequestId: this.observationId
            }
        };
        this.observationService.getObservationRequestByObservationId(apiRequest, this.callbackMethodForGetObservationRequest.bind(this));
    }

    // call back method of getobservationdatabyobservationid
    callbackMethodForGetObservationRequest(response) {
        if (response && response.Success) {
            this.observationData = response.Result;
            this.observationData.ObservationRequests.ObservationId = this.observationId;
            this.observationData.ObservationRequests.DisplayId = ObservationConstantsService.
            ObservationCardModuleConst.OBS.concat(this.observationId.toString());
            if (this.observationData.ObservationRequests.RaisedBy !== this.observationData.ObservationRequests.RaisedFor) {
                this.isShowOnBehalfDetails = true;
                const apiRequest = {
                    Model: {
                        UserId: this.observationData.ObservationRequests.RaisedFor,
                        Email: null
                    }
                };
                this.observationService.getUserDetails(apiRequest, this.callbackMethodForGetUserDetail.bind(this));
            } else {
                if (this.loggedInUserJSON.ReportingTo !== 0) {
                     const apiRequest = {
                    Model: {
                        UserId: this.loggedInUserJSON.ReportingTo,
                        Email: null
                    }
                };
                this.observationService.getUserDetails(apiRequest, this.callbackMethodForGetReportingManager.bind(this));
                }
            }
            this.setSelectedHazardTypes();
            this.setSelectedObservationTypes();
        } else {
            this.baseService.processApiResponseError(response);
        }
    }

    callbackMethodForGetUserDetail(response) {
        this.raiseFor = response.Result;
        this.raiseBy = this.loggedInUserJSON;
        this.loggedInUserJSON = this.raiseFor;
        if (this.loggedInUserJSON.ReportingTo !== 0) {
                const apiRequest = {
                    Model: {
                        UserId: this.loggedInUserJSON.ReportingTo,
                        Email: null
                    }
                };
                this.observationService.getUserDetails(apiRequest, this.callbackMethodForGetReportingManager.bind(this));
            }
    }
    callbackMethodForGetReportingManager(response) {
this.reportingTo = response.Result;
    }

    // To set selected values checked
    setSelectedHazardTypes() {
        for (let index = 0; index < this.observationData.ObservationRequests.HazardTypes.length; index++) {
            for (let innerindex = 0; innerindex < this.hazards.length; innerindex++) {
                if (this.observationData.ObservationRequests.HazardTypes[index] === this.hazards[innerindex].HazardId) {
                    this.hazards[innerindex].Checked = true;
                }
            }
        }
    }

    // To set selected observation type
    setSelectedObservationTypes() {
        for (let index = 0; index < this.observationType.length; index++) {
            if (this.observationData.ObservationRequests.ObservationTypeId > 0) {
                if (this.observationData.ObservationRequests.ObservationTypeId === this.observationType[index].ObservationTypeId) {
                    this.observationData.ObservationRequests.ObservationType = this.observationType[index].ObservationTypeName;
                }
            }
        }
    }
    //#endregion

    //#endregion - End Part of ngOnint

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
