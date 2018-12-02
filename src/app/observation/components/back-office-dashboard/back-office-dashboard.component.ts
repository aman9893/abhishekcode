import { Component, OnInit } from '@angular/core';

import { ObservationConstantsService } from '../../services/observation-constants.service';
import { BaseService } from '../../../shared/services/base.service';
import { ObservationService } from '../../services/observation.service';
import { ConstantsService } from '../../../shared/services/constants.service';

import { DashboardFilter } from '../../../shared/models/dashboardFilter.model';
import { TempObservationRequest } from '../../model/tempObservationRequest.model';
import { User } from '../../model/user.model';
import { CommonService } from '../../../shared/services/common.service';
import { Status } from '../../../actiontracker/model/status.model';

@Component({
  selector: 'app-back-office-dashboard',
  templateUrl: './back-office-dashboard.component.html',
  styleUrls: ['./back-office-dashboard.component.css']
})
export class BackOfficeDashboardComponent implements OnInit {
  loggedInUserJSON: any;
  tempObservationFilterData: DashboardFilter;
  itemPerPage: number = 10;
  statusId: number;
  tempObservationData: TempObservationRequest[];
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  statusList: Status[];
  defaultStatus: string;
  dateFormatDDMMYYYYHHMMSS = '';
  filterList: string[];
  hideFilter: boolean;
  hideSort: boolean;
  // set variable for pagination
  rowCount: number;
  pageSize: number;

  constructor(private baseService: BaseService,
    private observationService: ObservationService,
    private commonService: CommonService) {
    this.tempObservationFilterData = new DashboardFilter();
    this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
    this.tempObservationData = [];
    // Set routeURL and route name
    this.routesFlag = ObservationConstantsService.ObservationNavigation.Routes;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    this.statusList = [];
    this.filterList = [];
    this.defaultStatus = ObservationConstantsService.ObservationStatus.Pending;
    this.filterList.push(this.defaultStatus);
    // Set value for tab show and hide
    this.hideFilter = true;
    this.hideSort = true;
  }

  //#region - Set Filter data to get temp observation req which raised by mobile device
  // Set Status id based on status
  submitSelectedStatus(status) {
    this.filterList = [];
    this.filterList.push(status.StatusName);
    // Set StatusId on Selection
    this.statusId = status.StatusId;
    // Get Temp Obseravation Request for file upload by mobile user
    this.getTempObservationRequest();
  }

  //  check DESC Submit date data
  descSubmissionDate() {
    this.tempObservationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    this.tempObservationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    // Get Temp Obseravation Request for file upload by mobile user
    this.getTempObservationRequest();
  }

  //  check ASC Submit date data
  ascSubmissionDate() {
    this.tempObservationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    this.tempObservationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.ASC;
    // Get Temp Obseravation Request for file upload by mobile user
    this.getTempObservationRequest();
  }

  resetValue() {
    this.tempObservationFilterData = new DashboardFilter();
    this.defaultStatus = ObservationConstantsService.ObservationStatus.Pending;
    this.filterList = [];
    this.filterList.push(this.defaultStatus);
    // Get Pending Status Id
    this.getStatusIdByStatusName();
    // Get Temp Obseravation Request for file upload by mobile user
    this.getTempObservationRequest();
  }
  //#endregion

  //#region - Get Temp Observation requests for file upload by mobile user
  getTempObservationRequest() {
    this.baseService.showRootLoader = true;
    if (!this.tempObservationFilterData.OrderdByColoumName) {
      this.tempObservationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    }
    if (!this.tempObservationFilterData.OrderdBy) {
      this.tempObservationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.tempObservationFilterData.PageSize = this.itemPerPage;
    // Set Status Id into Object which will be extract on Service method
    this.tempObservationFilterData.InputParams = {
      Status: this.statusId
    };
    if (this.tempObservationFilterData) {
      const apiRequest = {
        Model: this.tempObservationFilterData
      };
      // Call To Get Temp observation requests for file upload by mobile user
      this.observationService.GetTempObservationRequestForBackOffice(apiRequest,
        this.callbackMethodForGetTempObservationRequest.bind(this));
    }
  }

  callbackMethodForGetTempObservationRequest(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.tempObservationData = response.Result;
      if (response.Result.length < this.itemPerPage) {
        this.rowCount = this.rowCount - this.itemPerPage;
      }
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region - get status List by process name
  getStatusListByProcessName() {
    // Create model for ProcessName
    const request = {
      Model: {
        ProcessName: ConstantsService.ProcessName.TempObservation
      }
    };
    // Get Status List by ProcessName
    this.commonService.getStatusListByProcessName(request, this.callbackMethodForGetStatusListByProcessName.bind(this));
  }

  // call back method of get status list by processName
  callbackMethodForGetStatusListByProcessName(response) {
    // Set list of status
    this.statusList = response;
    // get the Id of Pending Status
    this.getStatusIdByStatusName();
    // Get Temp Obseravation Request for file upload by mobile user
    this.getTempObservationRequest();
  }
  //#endregion

  //#region - common method for component
  // Set Status Id based on Status
  getStatusIdByStatusName() {
    this.statusList.filter((item) => {
      if (item.StatusName === ObservationConstantsService.ObservationStatus.Pending) {
        this.statusId = item.StatusId;
      }
    });
  }

  // Hide and show the filter click on outside
  onClickedOutside() {
    this.hideFilter = false;
    this.hideSort = false;
  }

  // Hide and show the filter based on tab selection
  onTabOpen() {
    this.hideFilter = true;
    this.hideSort = true;
  }

  // Method to call when next page is loaded
  getServerData(event) {
    if (event === 1) {
      this.tempObservationFilterData.PageIndex = 0;
    } else {
      this.tempObservationFilterData.PageIndex = ((event * this.itemPerPage) - this.itemPerPage);
      this.rowCount = ((event + 1) * this.itemPerPage);
    }
    this.pageSize = event;
    // Get Temp Obseravation Request for file upload by mobile user
    this.getTempObservationRequest();
  }
  //#endregion
  ngOnInit() {
    this.baseService.showRootLoader = true;
    const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    // Get List of Status by process name
    this.getStatusListByProcessName();
  }

}
