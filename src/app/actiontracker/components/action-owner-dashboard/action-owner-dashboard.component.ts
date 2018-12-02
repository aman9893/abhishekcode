import { Component, OnInit } from '@angular/core';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { ActionOwnerDAshboard } from '../../model/actionOwnerDashboard.model';
import { User } from '../../model/user.model';
import { ActiontrackerFilter } from '../../model/actiontrackerFilter.model';
import { Status } from '../../model/status.model';
import { Process } from '../../model/process.model';
import { Priority } from '../../model/priority.model';
import { BaseService } from '../../../shared/services/base.service';
import { TempObservationRequest } from '../../../observation/model/tempObservationRequest.model';

@Component({
  selector: 'app-action-owner-dashboard',
  templateUrl: './action-owner-dashboard.component.html',
  styleUrls: ['./action-owner-dashboard.component.css']
})
export class ActionOwnerDashboardComponent implements OnInit {

  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  prioritys: Priority[];
  loggedInUserJSON: any;
  actiontrackerFilterData: ActiontrackerFilter;
  actionData: ActionOwnerDAshboard[] = [];
  actionAssignedByUserData: User;
  isSelectedPriorityFull: boolean;
  isSelectedStatusDone: boolean;
  selectedPriority: number[] = [];
  selectedStatus: number[] = [];
  filterList: string[] = [];
  iterableStatusList: Status[] = [];
  statusList: Status;
  closerTabStatusList: Status;
  processList: Process[] = [];
  pageSize: number;
  rowCount: number;
  index: number;
  dashboardFor: string;
  itemPerPage: number = 10;
  isChecked: Boolean;
  isStatusNull: boolean;
  observationType: any;
  isSelectedSourceTypeFull: boolean;
  isDisplay: boolean = false;
  isHide: boolean = true;
  selectedSourceType: number[] = [];
  dateFormatDDMMYYYY = '';
  hideFilter: boolean;
  hideSort: boolean;
  defaultstatus: string;
  viewtooltip: string;
  ObservationProcess: string;
  RiskProcess: string;
  hideVerifierForRisk: boolean = false;

  constructor(private actionTrackerService: ActiontrackerService,
    private baseService: BaseService,
    private hseErrorHandler: HseErrorHandlerService) {
    this.actiontrackerFilterData = new ActiontrackerFilter();
    this.defaultstatus = ActiontrackerConstantsService.ActiontrackerModuleConst.Action;
    this.hideFilter = true;
    this.hideSort = true;
    this.viewtooltip = ActiontrackerConstantsService.ToolTip.AssignAction;
    this.ObservationProcess = ActiontrackerConstantsService.ActiontrackerModuleConst.Observation;
    this.RiskProcess = ActiontrackerConstantsService.ActiontrackerModuleConst.Risk;
    this.setAllPriorities();
  }
  setAllPriorities() {
this.prioritys = ActiontrackerConstantsService.Priority.Priority.filter(function (priority) {
  return priority.checked = true;
});
this.prioritys.forEach(priority => {
  this.selectedPriority.push(priority.Id);
  this.filterList.push(priority.Priority);
});
  }
  ngOnInit() {
    this.baseService.showRootLoader = true;
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.Routes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    this.prioritys = ActiontrackerConstantsService.Priority.Priority;
    for (const priority in this.prioritys) {
      if (this.prioritys.hasOwnProperty(priority)) {
        this.prioritys[priority].checked = true;
      }
    }
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    const loggedInUser = this.baseService.getItemFromSession(ActiontrackerConstantsService.ActiontrackerModuleConst.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
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

  // To get process
  getProcess() {
    this.actionTrackerService.getProcess(this.callbackMethodForgetProcess.bind(this));
  }

  // call back method of get process
  callbackMethodForgetProcess(response) {
    if (response.Success) {
      response.Result.forEach(process => {
        if (process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Observation ||
          process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Incident ||
          process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Meeting ||
          process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Risk) {
          process.checked = true;
          this.processList.push(process);
          }
          if (process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Action) {
            this.getStatusByProcessId(process.ProcessId);
          }
      });
    }
  }

  // To get status
  getStatusByProcessId(processId) {
    const apiRequest = {
      Model: {
        ProcessId: processId
      }
    };
    this.actionTrackerService.getStatusByProcessId(apiRequest, this.callbackMethodForgetStatus.bind(this));
  }

  // call back method of get  status
  callbackMethodForgetStatus(response) {
    this.baseService.showRootLoader = false;
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.statusList = response.Result;
      this.closerTabStatusList = response.Result.filter(function (status) {
        if (status.StatusName === ActiontrackerConstantsService.Status.Closed ||
          status.StatusName === ActiontrackerConstantsService.Status.Accepted ||
          status.StatusName === ActiontrackerConstantsService.Status.Rejected ||
          status.StatusName === ActiontrackerConstantsService.Status.Done) {
          return status;
        }
      });
      this.iterableStatusList = response.Result;
      if (this.iterableStatusList.length > 0) {
        this.getActionsByFilters();
      }
    }
  }

  // fetch the ation(s) from database by provided filters
  getActionsByFilters() {
    this.baseService.showRootLoader = true;
    if (!this.selectedStatus.length) {
      for (let index = 0; index < this.iterableStatusList.length; index++) {
        if (this.iterableStatusList[index].StatusName === ActiontrackerConstantsService.Status.New) {
          this.selectedStatus.push(this.iterableStatusList[index].StatusId);
          this.isSelectedStatusDone = true;
          this.dashboardFor = ActiontrackerConstantsService.Status.New;
        }
      }
      this.isStatusNull = false;
    }
    if (!this.actiontrackerFilterData.OrderdByColoumName) {
      this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    }
    if (!this.actiontrackerFilterData.OrderdBy) {
      this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
    }
    if (!this.selectedPriority.length) {
      this.prioritys.forEach(priority => {
        this.selectedPriority.push(priority.Id);
        this.isSelectedPriorityFull = true;
      });
    }
    if (this.selectedSourceType.length === 0) {
      this.processList.forEach(process => {
        this.selectedSourceType.push(process.ProcessId);
        this.isSelectedSourceTypeFull = true;
      });
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.actiontrackerFilterData.PageSize = this.itemPerPage;
    this.actiontrackerFilterData.UserId = this.loggedInUserJSON.UserId;
    this.actiontrackerFilterData.PriorityTypes = this.selectedPriority;
    this.actiontrackerFilterData.StatusId = this.selectedStatus;
    this.actiontrackerFilterData.ProcessIds = this.selectedSourceType;
    this.actiontrackerFilterData.DashboardFor = this.dashboardFor;
    const apiRequest = {
      Model: this.actiontrackerFilterData
    };
    this.actionTrackerService.getActionForActionOwnerDashboard(apiRequest, this.callbackMethodForgetActionsByFilters.bind(this));
  }

  // call back method of get action by filter
  callbackMethodForgetActionsByFilters(response) {
    this.baseService.showRootLoader = false;
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.actionData = response.Result;
      if (this.actionData.length < 10) {
        this.rowCount = this.rowCount - this.itemPerPage;
      }
      this.actionData.forEach(action => {
        if (action.ProcessName === this.RiskProcess) {
          action.ActionVerifier = 'NA';
        }
        this.prioritys.filter(priority => {
          if (action.Priority === priority.Id) {
            action.PriorityName = priority.Priority;
          }
        });
      });
    }
  }
  // check priority filter
  changeValuePriority(event, priority) {
    if (this.isSelectedPriorityFull === true) {
      this.selectedPriority = [];
    }
    if (event.target.checked === true) {
      this.selectedPriority.push(priority.Id);
      this.isSelectedPriorityFull = false;
      this.filterList.push(priority.Priority);
    } else {
      const index = this.selectedPriority.indexOf(priority.Id);
      const filterIndex = this.filterList.indexOf(priority.Priority);
      if (index > -1) {
        this.selectedPriority.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }

  // all the filter are applied
  doneFilter() {
    if (this.rowCount === 10) {
      this.rowCount = this.rowCount * 2;
    }
    this.getActionsByFilters();
  }

  // reset all the filter
  reset() {
    for (const process in this.processList) {
      if (this.processList.hasOwnProperty(process)) {
        this.processList[process].checked = true;
      }
    }
    for (const status in this.statusList) {
      if (this.statusList.hasOwnProperty(status)) {
        this.statusList[status].checked = true;
      }
    } for (const priority in this.prioritys) {
      if (this.prioritys.hasOwnProperty(priority)) {
        this.prioritys[priority].checked = true;
      }
    }
    this.defaultstatus = ActiontrackerConstantsService.ActiontrackerModuleConst.Action;
    this.filterList = [];
    this.selectedPriority = [];
    this.selectedStatus = [];
    this.selectedSourceType = [];
    this.rowCount = this.itemPerPage * 2;
    this.getActionsByFilters();
  }

  // check DESC Created date data
  descActionAssignDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
    this.getActionsByFilters();
  }

  //  check ASC Created date data
  ascActionAssignDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.ASC;
    this.getActionsByFilters();
  }

  //  check DESC Target date data
  descActionDueDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.TargetDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
    this.getActionsByFilters();
  }

  //  check ASC Target date data
  ascActionDueDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.TargetDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.ASC;
    this.getActionsByFilters();
  }

  // Call when next page call
  getServerData(event) {
    if (event === 1) {
      this.actiontrackerFilterData.PageIndex = 0;
    } else {
      this.actiontrackerFilterData.PageIndex = ((event * this.itemPerPage) - this.itemPerPage);
      this.rowCount = ((event + 1) * this.itemPerPage);
    }
    this.pageSize = event;
    this.getActionsByFilters();
  }

  // check source type filter
  changeValueSourceType(event, process) {
    // if (this.isSelectedSourceTypeFull === true) {
    //   this.selectedSourceType = [];
    // }
    if (event.target.checked === true) {
      this.selectedSourceType.push(process.ProcessId);
      this.isSelectedSourceTypeFull = false;
      this.filterList.push(process.ProcessName);
    } else {
      const index = this.selectedSourceType.indexOf(process.ProcessId);
      const filterIndex = this.filterList.indexOf(process.ProcessName);
      if (index > -1) {
        this.selectedSourceType.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }

  // when move to next tab
  tabChange(value) {
    this.selectedStatus = [];
    switch (value) {
      case ActiontrackerConstantsService.Status.Assigned:
        this.viewtooltip = ActiontrackerConstantsService.ToolTip.DoneAction;
        // Set Status Id for Assigned request
        this.iterableStatusList.filter((status) => {
          if (status.StatusName === ActiontrackerConstantsService.Status.Open) {
            this.selectedStatus.push(status.StatusId);
            this.isSelectedStatusDone = true;
            this.dashboardFor = ActiontrackerConstantsService.Status.Open;
          }
        });
        break;
      case ActiontrackerConstantsService.Status.Closure:
        this.isDisplay = true;
        this.isHide = false;
        this.viewtooltip = ActiontrackerConstantsService.ToolTip.DoneAction;
        // Set Status Id for Assigned request
        this.iterableStatusList.filter((status) => {
          if (status.StatusName === ActiontrackerConstantsService.Status.Done) {
            this.selectedStatus.push(status.StatusId);
            this.isSelectedStatusDone = true;
            this.dashboardFor = ActiontrackerConstantsService.Status.Closure;
          }
        });
        break;
      case ActiontrackerConstantsService.Status.Pending:
        this.viewtooltip = ActiontrackerConstantsService.ToolTip.AssignAction;
        this.selectedStatus = [];
        break;
    }
    this.filterList = [];
    this.selectedPriority = [];
    this.rowCount = this.itemPerPage * 2;
    this.getActionsByFilters();
  }

  // call when status is change
  changeValueStatus(event, status) {
    if (this.isSelectedStatusDone === true) {
      this.selectedStatus = [];
    }
    if (status.StatusName === ActiontrackerConstantsService.Status.Closed) {
      this.isDisplay = false;
      this.isHide = true;
    }
    if (status.StatusName === ActiontrackerConstantsService.Status.Closed ||
      status.StatusName === ActiontrackerConstantsService.Status.Accepted ||
      status.StatusName === ActiontrackerConstantsService.Status.Rejected ||
      status.StatusName === ActiontrackerConstantsService.Status.Done
    ) {
      this.viewtooltip = ActiontrackerConstantsService.ToolTip.DoneAction;
    }
    if (event.target.checked === true) {
      this.selectedStatus = [];
      this.selectedStatus.push(status.StatusId);
      this.isSelectedStatusDone = false;
      this.filterList.push(status.StatusName);
      this.getActionsByFilters();
    } else {
      const index = this.selectedStatus.indexOf(status.StatusId);
      const filterIndex = this.filterList.indexOf(status.StatusName);
      if (index > -1) {
        this.selectedStatus.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }
}

