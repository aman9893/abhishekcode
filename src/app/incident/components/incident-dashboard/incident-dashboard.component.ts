import { Component, OnInit } from '@angular/core';

import { CommonService } from './../../../shared/services/common.service';
import { BaseService } from './../../../shared/services/base.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { IncidentConstantsService } from './../../services/incident-constants-service';
import { IncidentService } from './../../services/incident.service';

import { IncidentRequestGet } from './../../model/incidentRequestPost.model';
import { DashboardFilter } from './../../../shared/models/dashboardFilter.model';
import { Status } from './../../../observation/model/status.model';

@Component({
  selector: 'app-incident-dashboard',
  templateUrl: './incident-dashboard.component.html',
  styleUrls: ['./incident-dashboard.component.css']
})
export class IncidentDashboardComponent implements OnInit {
  loggedInUserJSON: any;
  statusList: Status[];
  statusId: number;
  incidentFilterData: DashboardFilter;
  incidentRequestData: IncidentRequestGet[];
  // set variable for pagination
  rowCount: number;
  pageSize: number;
  itemPerPage: number = 10;
  hideFilter: boolean;
  hideSort: boolean;
  filterList: string[];
  defaultStatus: string;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];

  constructor(private baseService: BaseService,
    private commonService: CommonService,
    private incidentService: IncidentService) {
    this.incidentFilterData = new DashboardFilter();
    this.incidentRequestData = [];
    this.statusList = [];
    this.filterList = [];
    this.defaultStatus = 'New';
    this.filterList.push(this.defaultStatus);
    // Set value for tab show and hide
    this.hideFilter = true;
    this.hideSort = true;
    // Set routeURL and route name
    this.routesFlag = IncidentConstantsService.IncidentNavigation.Routes;
    this.reportRoutes = IncidentConstantsService.IncidentNavigation.ReportRoutes;
  }

  //#region - get status List by process name
  getStatusListByProcessName() {
    this.baseService.showRootLoader = true;
    // Create model for ProcessName
    const request = {
      Model: {
        ProcessName: ConstantsService.ProcessName.Incident
      }
    };
    // Get Status List by ProcessName
    this.commonService.getStatusListByProcessName(request, this.callbackMethodForGetStatusListByProcessName.bind(this));
  }

  // call back method of get status list by processName
  callbackMethodForGetStatusListByProcessName(response) {
    this.baseService.showRootLoader = false;
    // Set list of status
    this.statusList = response;
    // get the Id of Pending Status
    this.getStatusIdByStatusName();
  }
  //#endregion

  //#region - Set Filter data to get temp observation req which raised by mobile device
  // Set Status id based on status
  submitSelectedStatus(status) {
    this.baseService.showRootLoader = true;
    this.filterList = [];
    this.filterList.push(status.StatusName);
    // Set StatusId on Selection
    this.statusId = status.StatusId;
    // Get Incident Request for specifc user id
    this.getIncidentRequestByUserId();
  }

  //  check DESC Submit date data
  descSubmissionDate() {
    this.incidentFilterData.OrderdByColoumName = IncidentConstantsService.DasboardFilter.SubmitDate;
    this.incidentFilterData.OrderdBy = IncidentConstantsService.DasboardFilter.DESC;
    // Get Incident Request for specifc user id
    this.getIncidentRequestByUserId();
  }

  //  check ASC Submit date data
  ascSubmissionDate() {
    this.incidentFilterData.OrderdByColoumName = IncidentConstantsService.DasboardFilter.SubmitDate;
    this.incidentFilterData.OrderdBy = IncidentConstantsService.DasboardFilter.ASC;
    // Get Incident Request for specifc user id
    this.getIncidentRequestByUserId();
  }

  resetValue() {
    this.incidentFilterData = new DashboardFilter();
    this.defaultStatus = 'New';
    this.filterList = [];
    this.filterList.push(this.defaultStatus);
    // Get Pending Status Id
    this.getStatusIdByStatusName();
  }
  //#endregion


  //#region - Get Incident requets for specific user
  getIncidentRequestByUserId() {
    this.baseService.showRootLoader = true;
    if (!this.incidentFilterData.OrderdByColoumName) {
      this.incidentFilterData.OrderdByColoumName = IncidentConstantsService.DasboardFilter.SubmitDate;
    }
    if (!this.incidentFilterData.OrderdBy) {
      this.incidentFilterData.OrderdBy = IncidentConstantsService.DasboardFilter.DESC;
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.incidentFilterData.PageSize = this.itemPerPage;
    // Set Status Id into Object which will be extract on Service method
    this.incidentFilterData.InputParams = {
      StatusId: this.statusId,
      RaisedBy: this.loggedInUserJSON.UserId
    };
    if (this.incidentFilterData) {
      const apiRequest = {
        Model: this.incidentFilterData
      };
      // Call To Get Incident requests for specific user id
      this.incidentService.getIncidentRequestByUserId(apiRequest,
        this.callbackMethodForGetIncidentRequestByUserId.bind(this));
    }
    this.baseService.showRootLoader = false;
  }

  callbackMethodForGetIncidentRequestByUserId(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.incidentRequestData = response.Result;
      if (response.Result.length < this.itemPerPage) {
        this.rowCount = this.rowCount - this.itemPerPage;
      }
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region - common method for component
  // Set Status Id based on Status
  getStatusIdByStatusName() {
    this.statusList.filter((item) => {
      if (item.StatusName === IncidentConstantsService.IncidentStatus.New) {
        this.statusId = item.StatusId;
      }
    });
    // Get Incident requets for specific user
    this.getIncidentRequestByUserId();
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
      this.incidentFilterData.PageIndex = 0;
    } else {
      this.incidentFilterData.PageIndex = ((event * this.itemPerPage) - this.itemPerPage);
      this.rowCount = ((event + 1) * this.itemPerPage);
    }
    this.pageSize = event;
    // Get Temp Obseravation Request for file upload by mobile user
    this.getIncidentRequestByUserId();
  }
  //#endregion

  ngOnInit() {
    this.baseService.showRootLoader = true;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    // Get List of Status by process name
    this.getStatusListByProcessName();
  }

}
