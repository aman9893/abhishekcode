import { Component, OnInit } from '@angular/core';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { BaseService } from '../../../shared/services/base.service';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { Action } from '../../../actiontracker/model/action.model';
import { User } from '../../model/user.model';
import { ActiontrackerFilter } from '../../model/actiontrackerFilter.model';
import { Status } from '../../model/status.model';
import { Process } from '../../model/process.model';
import { Priority } from '../../model/priority.model';

@Component({
  selector: 'app-action-tracker-dashboard',
  templateUrl: './action-tracker-dashboard.component.html',
  styleUrls: ['./action-tracker-dashboard.component.css']
})

export class ActionTrackerDashboardComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: any;
  loggedInUserJSON: any;
  actionAssignFromDate: Date;
  actionAssignToDate: Date;
  isSelectedPriorityFull: boolean;
  isSelectedProcessFull: boolean;
  actiontrackerFilterData: ActiontrackerFilter;
  actionData: Action[] = [];
  actionAssignedByUserData: User;
  selectedSourceType: number[] = [];
  selectedPriorityType: number[] = [];
  selectedStatus: number[] = [];
  filterList: string[] = [];
  iterableStatusList: Status[] = [];
  status: Status[] = [];
  statusList: Status;
  processList: Process[] = [];
  processes: Process[] = [];
  pageSize: number;
  rowCount: number;
  index: number;
  dateTime: Date;
  itemPerPage: number = 10;
  isChecked: Boolean;
  priorities: Priority[];
  isStatusNull: boolean;
  showPagination: boolean = false;
  noRecordsMsg: string;
  dateFormatDDMMYYYY = '';
  hideFilter: boolean;
  hideSort: boolean;
  viewToolTip: string;

  constructor(
    private baseService: BaseService,
    private hseErrorHandler: HseErrorHandlerService,
    private actionTrackerService: ActiontrackerService
  ) {
    this.actiontrackerFilterData = new ActiontrackerFilter();
    this.hideFilter = true;
    this.hideSort = true;
    this.viewToolTip = ActiontrackerConstantsService.ToolTip.ExecuteAction;
  }

  ngOnInit() {
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.dateTime = new Date();
    this.dateTime.setDate(this.dateTime.getDate());
    this.priorities = ActiontrackerConstantsService.Priority.Priority;
    for (const priority in this.priorities) {
      if (this.priorities.hasOwnProperty(priority)) {
        this.priorities[priority].checked = true;
      }
    }
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.Routes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
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

  getUserDetails(AssignedById) {
    const apiRequest = {
      Model: {
        UserId: AssignedById,
        Email: null
      }
    };
    this.actionTrackerService.getUserDetails(apiRequest, this.callbackMethodForgetUserDetails.bind(this));
  }

  callbackMethodForgetUserDetails(response) {
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
    }
  }

  // fetch the ation(s) from database by provided filters
  getActionsByFilters() {
    if (this.selectedStatus.length === 0) {
      this.status.forEach(status => {
        if (status.StatusName === ActiontrackerConstantsService.Status.Open ||
          status.StatusName === ActiontrackerConstantsService.Status.Reopen) {
          this.selectedStatus.push(status.StatusId);
          this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.TargetDate;
          this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
        }
      });
      this.isStatusNull = false;
    }
    if (!this.actiontrackerFilterData.OrderdByColoumName) {
      this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    }
    if (!this.actiontrackerFilterData.OrderdBy) {
      this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
    }
    if (this.selectedSourceType.length === 0) {
      this.processList.forEach(process => {
        this.selectedSourceType.push(process.ProcessId);
      });
      this.isSelectedProcessFull = true;
    }
    if (this.selectedPriorityType.length === 0) {
      this.priorities.forEach(priority => {
        this.selectedPriorityType.push(priority.Id);
      });
      this.isSelectedPriorityFull = true;
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.actiontrackerFilterData.PageSize = this.itemPerPage;
    this.actiontrackerFilterData.UserId = this.loggedInUserJSON.UserId;
    this.actiontrackerFilterData.ProcessIds = this.selectedSourceType;
    this.actiontrackerFilterData.PriorityTypes = this.selectedPriorityType;
    this.actiontrackerFilterData.ActionAssignFromDate = this.actionAssignFromDate;
    this.actiontrackerFilterData.ActionAssignToDate = this.actionAssignToDate;
    this.actiontrackerFilterData.StatusId = this.selectedStatus;
    const apiRequest = {
      Model: this.actiontrackerFilterData
    };
    this.actionTrackerService.getActionsByFilters(apiRequest, this.callbackMethodForgetActionsByFilters.bind(this));
  }

  callbackMethodForgetActionsByFilters(response) {
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.onClickedOutside();
      this.actionData = response.Result;
      if (this.actionData.length > 0) {
        this.showPagination = true;
        this.actionData.forEach(action => {
          const createdDate = new Date(action.CreatedDate);
          const targetDate = new Date(action.TargetDate);
          action.ActionPriority = this.changePriorityFormat(action.Priority);
          this.processList.forEach(process => {
            if (process.ProcessId === action.Source) {
              action.SourceText = process.ProcessName;
            }
          });
          if (targetDate.valueOf() < this.dateTime.valueOf()) {
            action.DueDateColour = ActiontrackerConstantsService.DueDate.OverDueAction;
          } else {
            action.DueDateColour = ActiontrackerConstantsService.DueDate.ApprochingAction;
          }
        });
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
  }

  // return the priority in string format
  changePriorityFormat(priorityToFormat) {
    let strPriority = null;
    switch (priorityToFormat) {
      case 1:
        strPriority = 'High';
        break;
      case 2:
        strPriority = 'Medium';
        break;
      case 3:
        strPriority = 'Low';
        break;
    }
    return strPriority;
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

  // call back method of submit observation
  callbackMethodForgetStatus(response) {
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.status = response.Result;
      let localDefaultStatusId = 0;
      let localDefaultStatusName = '';
      this.statusList = response.Result.filter(function (status) {
        if (status.StatusName === ActiontrackerConstantsService.Status.Open ||
          status.StatusName === ActiontrackerConstantsService.Status.Done) {
          status.checked = status.StatusName === ActiontrackerConstantsService.Status.Open ? true : false;
          if (status.StatusName === ActiontrackerConstantsService.Status.Done) {
            status.StatusName = ActiontrackerConstantsService.Status.Completed;
          }
          if (status.checked) {
            localDefaultStatusId = status.StatusId;
            localDefaultStatusName = status.StatusName;
          }
          return status;
        }
      });
      this.filterList.push(localDefaultStatusName);
      response.Result.forEach(status => {
        if (status.StatusName === ActiontrackerConstantsService.Status.Open ||
          status.StatusName === ActiontrackerConstantsService.Status.Done) {
          this.iterableStatusList.push(status);
        }
      });


      this.getActionsByFilters();
    }
  }

  // To get process
  getProcess() {
    this.actionTrackerService.getProcess(this.callbackMethodForgetProcess.bind(this));
  }

  // call back method of get process
  callbackMethodForgetProcess(response) {
    this.processList = response.Result;
    this.processList.forEach(process => {
      if (process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Observation ||
        process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Risk ||
        process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Incident ||
        process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Meeting) {
        process.checked = true;
        this.processes.push(process);
      }
    });
    this.processList.forEach(process => {
      if (process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Action) {
        this.getStatusByProcessId(process.ProcessId);
      }
    });
  }

  // Check status filter
  submitCheckedStatus(value, event): void {
    if (event.target.checked === true) {
      if (value.StatusName === ActiontrackerConstantsService.Status.Completed) {
        this.viewToolTip = ActiontrackerConstantsService.ToolTip.DoneAction;
      } else {
        this.viewToolTip = ActiontrackerConstantsService.ToolTip.ExecuteAction;

      }
      this.isStatusNull = true;
      this.selectedStatus.push(value.StatusId);
      this.filterList.push(value.StatusName);
    } else {
      this.isStatusNull = true;
      const index = this.selectedStatus.indexOf(value.StatusId);
      const filterIndex = this.filterList.indexOf(value.StatusName);
      if (index > -1) {
        this.selectedStatus.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }

  // check source type filter
  // check source type filter
  changeValueSourceType(event, process) {
    if (this.isSelectedProcessFull === true) {
      this.selectedSourceType = [];
    }
    if (event.target.checked === true) {
      this.selectedSourceType.push(process.ProcessId);
      this.isSelectedProcessFull = false;
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
  // check priority filter
  changeValuePriority(event, priority) {
    if (this.isSelectedPriorityFull === true) {
      this.selectedPriorityType = [];
    }
    if (event.target.checked === true) {
      this.selectedPriorityType.push(priority.Id);
      this.isSelectedPriorityFull = false;
      this.filterList.push(priority.Priority);
    } else {
      const index = this.selectedPriorityType.indexOf(priority.Id);
      const filterIndex = this.filterList.indexOf(priority.Priority);
      if (index > -1) {
        this.selectedPriorityType.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }

  // reset all filtered value
  resetValue = () => {
    for (const process in this.processes) {
      if (this.processes.hasOwnProperty(process)) {
        this.processes[process].checked = true;
      }
    } for (const priority in this.priorities) {
      if (this.priorities.hasOwnProperty(priority)) {
        this.priorities[priority].checked = true;
      }
    }
    for (const status in this.statusList) {
      if (this.statusList.hasOwnProperty(status)) {
        this.statusList[status].checked = false;
        this.statusList[0].checked = true;
      }
    }
    this.actiontrackerFilterData = new ActiontrackerFilter();
    this.filterList = [];
    this.selectedStatus = [];
    this.selectedSourceType = [];
    this.selectedPriorityType = [];
    this.actionAssignFromDate = null;
    this.actionAssignToDate = null;
    this.getActionsByFilters();
  }

  // Called after filter application
  doneFilter() {
    this.rowCount = this.itemPerPage * 2;
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
}
