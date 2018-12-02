import { Component, OnInit } from '@angular/core';
import { ObservationService } from '../../services/observation.service';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ObservationCardFilter } from '../../model/observationCardFilter.model';
import { Status } from '../../model/status.model';
import { Process } from '../../model/process.model';
import { ObservationRequestForHSEAdvisor } from '../../model/observationRequestForHSEAdvisor.model';
import { BaseService } from '../../../shared/services/base.service';
import { Action } from '../../../actiontracker/model/action.model';
import { ActiontrackerConstantsService } from '../../../actiontracker/services/actiontracker-constants.service';
import { Priority } from '../../../actiontracker/model/priority.model';

@Component({
  selector: 'app-observation-dashboard',
  templateUrl: './observation-dashboard.component.html',
  styleUrls: ['./observation-dashboard.component.css']
})
export class ObservationDashboardComponent implements OnInit {
  loggedInUserJSON: any;
  alertType: string;
  priorities: Priority[];
  takeAction: string;
  isClosureDate: boolean = false;
  isDeletionDateDisplay: boolean = false;
  isActionAssignedDisplay: boolean = false;
  observationFilterData: ObservationCardFilter;
  observationData: ObservationRequestForHSEAdvisor[];
  statusList: Status;
  actions: Action[];
  status: Status[];
  pageSize: number;
  rowCount: number;
  index: number;
  itemPerPage: number = 10;
  selectedStatus: number[] = [];
  filterList: string[] = [];
  isChecked: Boolean;
  isStatusNull: boolean;
  isObservationTypeNull: boolean;
  observationType: any;
  hazard: string[] = [];
  hazards: any;
  selectedObservationType: number[] = [];
  processList: Process[] = [];
  showPagination: boolean = true;
  noRecordsMsg: string;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  dateFormatDDMMYYYY = '';
  dateFormatDDMMYYYYHHMMSS = '';
  hideFilter: boolean;
  hideSort: boolean;
  defaultStatus: string;
  closedtooltip: string;
  isHSEAdvisor: boolean = false;
  uniqueObservationTypeFilterList: string[];

  constructor(private observationService: ObservationService,
    private baseService: BaseService) {
    this.observationFilterData = new ObservationCardFilter();
    this.filterList.push(ObservationConstantsService.ObservationStatus.New);
    this.defaultStatus = ObservationConstantsService.ObservationStatus.New;
    this.hideFilter = true;
    this.hideSort = true;
    this.closedtooltip = ObservationConstantsService.Tooltip.TakeAction;
    this.uniqueObservationTypeFilterList = [];
  }

  ngOnInit() {
    // Initailize instance of constant variable -  routeURL and route name
    this.routesFlag = ObservationConstantsService.ObservationNavigation.Routes;
    this.priorities = ActiontrackerConstantsService.Priority.Priority;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
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
    this.takeAction = ObservationConstantsService.ObservationCardModuleConst.TakeAction;
    this.getProcess();
  }

  onClickedOutside() {
    this.hideFilter = false;
    this.hideSort = false;
  }

  onTabOpen() {
    this.hideFilter = true;
    this.hideSort = true;
  }

  // to get observation data
  getObservationData() {
    if (!this.selectedStatus.length) {
      for (let index = 0; index < this.status.length; index++) {
        if (this.status[index].StatusName === ObservationConstantsService.Status.New) {
          this.selectedStatus.push(this.status[index].StatusId);
          this.observationFilterData.DashboardFor = ObservationConstantsService.Status.New;
          this.isStatusNull = false;
        }
      }
    }
    if (!this.observationFilterData.OrderdByColoumName) {
      this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    }
    if (!this.observationFilterData.OrderdBy) {
      this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    }
    if (!this.selectedObservationType.length) {
      for (let index = 0; index < this.observationType.length; index++) {
        this.selectedObservationType.push(this.observationType[index].ObservationTypeId);
        this.isObservationTypeNull = false;
      }
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    if (!this.observationFilterData.DashboardFor) {
      this.observationFilterData.DashboardFor = ObservationConstantsService.ObservationCardModuleConst.Other;
    }
    this.observationFilterData.PageSize = this.itemPerPage;
    this.observationFilterData.EmployeeId = this.loggedInUserJSON.UserId;
    this.observationFilterData.Observationtypes = this.selectedObservationType;
    this.observationFilterData.Status = this.selectedStatus;
    if (this.observationFilterData) {
      const apiRequest = {
        Model: this.observationFilterData
      };
      // Call dummy method to post data
      this.observationService.getObservationRequestForHSEAdvisor(apiRequest, this.callbackMethodForGetObservationData.bind(this));
    }
  }

  // call back method of submit observation
  callbackMethodForGetObservationData(response) {
    this.observationData = response.Result;
    this.showPagination = true;
    for (let index = 0; index < this.observationData.length; index++) {
      if (this.observationData[index].Status === ObservationConstantsService.Status.New) {
        for (let innerIndex = 0; innerIndex < this.observationData[index].Action.length; innerIndex++) {
          if (this.observationData[index].Action[innerIndex].ActionId !== 0) {
            this.observationData.splice(index, 1);
            index--;
            break;
          }
          break;
        }
      }
    }
    for (let index = 0; index < this.observationType.length; index++) {
      for (const value in this.observationData) {
        if (this.observationData[value].ObservationTypeId === this.observationType[index].ObservationTypeId) {
          this.observationData[value].ObservationType = this.observationType[index].ObservationTypeName;
        }
      }
    }
    if (!response.Result || response.Result.length < this.itemPerPage) {
      this.rowCount = this.rowCount - this.itemPerPage;
    }
    if (response.Success) {
      if (response.Result.length === 0) {
        this.showPagination = false;
      } else {
        this.noRecordsMsg = 'No records found!';
      }
    }
  }

  // To get process
  getProcess() {
    this.observationService.getProcess(this.callbackMethodForgetProcess.bind(this));
  }

  // call back method of get process
  callbackMethodForgetProcess(response) {
    this.processList = response.Result;
    this.processList.forEach(process => {
      if (process.ProcessName === 'Observation') {
        this.getStatusByProcessId(process.ProcessId);
      }
    });
  }
  // To get status
  getStatusByProcessId(processId) {
    const apiRequest = {
      Model: {
        ProcessId: processId
      }
    };
    this.observationService.getStatusByProcessId(apiRequest, this.callbackMethodForgetStatus.bind(this));
  }

  // call back method of submit observation
  callbackMethodForgetStatus(response) {
    if (response.Success) {
      this.status = response.Result;
      response.Result.forEach(status => {
        if (status.StatusName === ObservationConstantsService.Status.Cancelled) {
          const index = response.Result.indexOf(status);
          response.Result.splice(index, 1);
        }
      }
      );
      this.statusList = response.Result.concat(ObservationConstantsService.StatusList);
      this.getObservationTypeByCompanyId();
    }
  }

  // Check status filter
  submitCheckedStatus(value, event): void {
    this.takeAction = ObservationConstantsService.ObservationCardModuleConst.TakeAction;
    this.isClosureDate = false;
    this.isDeletionDateDisplay = false;
    this.isActionAssignedDisplay = false;
    this.observationFilterData.DashboardFor = null;
    this.selectedStatus = [];

    if (event.target.checked) {


      this.isStatusNull = true;
      this.selectedStatus.push(value.StatusId);
      this.filterList = [];
      this.filterList.push(value.StatusName);
      if (this.uniqueObservationTypeFilterList.length > 0) {
        // this.filterList = (this.uniqueObservationTypeFilterList).slice();
        this.filterList.push.apply(this.filterList, this.uniqueObservationTypeFilterList);
      }
      if (value.StatusName === ObservationConstantsService.Status.Closed) {
        this.isClosureDate = true;
        this.takeAction = ObservationConstantsService.ObservationCardModuleConst.ViewClosureDetails;
        this.closedtooltip = ObservationConstantsService.Tooltip.ViewDetails;
      } else {
        this.closedtooltip = ObservationConstantsService.Tooltip.TakeAction;

      }
      if (value.StatusName === ObservationConstantsService.Status.Deleted) {
        this.closedtooltip = ObservationConstantsService.Tooltip.ViewDetails;
        this.isDeletionDateDisplay = true;
      }
      if (value.StatusName === ObservationConstantsService.Status.Assigned) {
        this.closedtooltip = ObservationConstantsService.Tooltip.ViewAction;
        this.observationFilterData.DashboardFor = ObservationConstantsService.Status.Assigned;
        for (let index = 0; index < this.status.length; index++) {
          if (this.status[index].StatusName === ObservationConstantsService.Status.New) {
            value.StatusId = this.status[index].StatusId;
          }
        }
        this.isActionAssignedDisplay = true;
      }

    } else {
      this.isStatusNull = true;
      const index = this.selectedStatus.indexOf(value.StatusId);
      const filterIndex = this.filterList.indexOf(value.StatusName);
      if (index > -1) {
        this.selectedStatus.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }

    if (value.StatusName === ObservationConstantsService.Status.New) {
      this.observationFilterData.DashboardFor = ObservationConstantsService.Status.New;
    }
    if (value.StatusName === ObservationConstantsService.Status.Acknowledged) {
      this.observationFilterData.DashboardFor = ObservationConstantsService.Status.Acknowledged;
    }
    this.getObservationData();
  }

  // check observation type filter
  changeValue(value, observationType) {
    if (this.isObservationTypeNull === false) {
      this.selectedObservationType = [];
    }
    if (value === true) {
      this.isObservationTypeNull = true;
      this.selectedObservationType.push(observationType.ObservationTypeId);
      // this.uniqueObservationTypeFilterList = [];
      this.uniqueObservationTypeFilterList.push(observationType.ObservationTypeName);
      this.filterList.push(observationType.ObservationTypeName);
    } else {
      const index = this.selectedObservationType.indexOf(observationType.ObservationTypeId);
      const filterIndex = this.filterList.indexOf(observationType.ObservationTypeName);
      const uniquefilterIndex = this.uniqueObservationTypeFilterList.indexOf(observationType.ObservationTypeName);
      if (index > -1) {
        this.selectedObservationType.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
      if (uniquefilterIndex > -1) {
        // this.selectedObservationType.splice(index, 1);
        this.uniqueObservationTypeFilterList.splice(uniquefilterIndex, 1);
      }
    }
    this.getObservationData();
  }

  // check DESC observation date data
  descObservationDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.ObservationDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.ASC;
    this.getObservationData();
  }

  //  check ASC observation date data
  ascObservationDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.ObservationDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    this.getObservationData();
  }

  //  check DESC Submit date data
  descSubmissionDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.ASC;
    this.getObservationData();
  }

  //  check ASC Submit date data
  ascSubmissionDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    this.getObservationData();
  }

  // call when apply all filter
  doneFilter() {
    this.rowCount = this.itemPerPage * 2;
    this.getObservationData();
  }

  // Call when next page call
  getServerData(event) {
    if (event === 1) {
      this.observationFilterData.PageIndex = 0;
    } else {
      this.observationFilterData.PageIndex = ((event * this.itemPerPage) - this.itemPerPage);
      this.rowCount = ((event + 1) * this.itemPerPage);
    }
    this.pageSize = event;
    this.getObservationData();
  }

  // reset all value
  resetValue = () => {
    for (let index = 0; index < this.observationType.length; index++) {
      this.observationType[index].checked = true;
    }
    for (const status in this.statusList) {
      if (this.statusList.hasOwnProperty(status)) {
        this.statusList[status].checked = false;
      }
    }
    this.defaultStatus = ObservationConstantsService.ObservationStatus.New;
    this.observationFilterData = new ObservationCardFilter();
    this.filterList = [];
    this.filterList.push(ObservationConstantsService.ObservationStatus.New);
    this.uniqueObservationTypeFilterList = [];
    this.selectedStatus = [];
    this.selectedObservationType = [];
    this.getObservationData();
  }

  // to get selected observation id
  deleteObservationRequestId(Id) {
    this.observationService.getSelectedObservationRequestId(Id);
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
      this.observationType.forEach(item => {
        item['checked'] = true;
      });
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.getHazardTypeByCompanyId();
  }
  //#endregion

  //#region- get Observation Type from configuration
  getHazardTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'CompanyId': this.loggedInUserJSON.Company.CompanyId
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

  // close the filter
  closeFilter(value) {
    const filterIndex = this.filterList.indexOf(value);
    if (filterIndex > -1) {
      this.filterList.splice(filterIndex, 1);
    }
    for (let index = 0; index < this.observationType.length; index++) {
      if (this.observationType[index].ObservationTypeName === value) {
        const observationIndex = this.selectedObservationType.indexOf(this.observationType[index].ObservationTypeId);
        if (observationIndex > -1) {
          this.selectedObservationType.splice(observationIndex, 1);
          this.observationType[index].checked = false;
        }
      }
    }
    for (let index = 0; index < this.status.length; index++) {
      if (this.status[index].StatusName === value) {
        const statusindex = this.selectedStatus.indexOf(this.status[index].StatusId);
        if (statusindex > -1) {
          this.selectedStatus.splice(statusindex, 1);
          for (const status in this.statusList) {
            if (this.statusList.hasOwnProperty(status)) {
              if (this.statusList[status].StatusName === value) {
                this.statusList[status].checked = false;
              }
            }
          }
        }
      }
    }
    this.getObservationData();
  }
  showAction(observationId) {
    const apiRequest = {
      Model: {
        'ObservationRequestId': observationId
      }
    };
    // Get all observation type data
    this.observationService.getAllActionByObservationId(apiRequest, this.callbackMethodForGetAllActionByObservationId.bind(this));
  }

  callbackMethodForGetAllActionByObservationId(response) {
    this.actions = response.Result;
    this.actions.forEach(action => {
      this.priorities.forEach(priority => {
        if (action.Priority === priority.Id) {
          action.PriorityName = priority.Priority;
        }
      });
    });
  }
}


