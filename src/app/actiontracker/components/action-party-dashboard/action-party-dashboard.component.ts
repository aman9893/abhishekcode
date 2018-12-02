import { Component, OnInit } from '@angular/core';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { Action } from '../../model/action.model';
import { User } from '../../model/user.model';
import { ActiontrackerFilter } from '../../model/actiontrackerFilter.model';
import { Status } from '../../model/status.model';
import { Process } from '../../model/process.model';
import { Priority } from '../../model/priority.model';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-action-party-dashboard',
  templateUrl: './action-party-dashboard.component.html',
  styleUrls: ['./action-party-dashboard.component.css']
})
export class ActionPartyDashboardComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  priorities: Priority[];
  loggedInUserJSON: any;
  actiontrackerFilterData: ActiontrackerFilter;
  actionData: Action[] = [];
  actionAssignedByUserData: User;
  isSelectedPriorityFull: boolean;
  isSelectedStatusDone: boolean;
  selectedPriority: number[] = [];
  selectedStatus: number[] = [];
  filterList: string[] = [];
  iterableStatusList: Status[] = [];
  statusList: Status;
  processList: Process[] = [];
  pageSize: number;
  rowCount: number;
  index: number;
  itemPerPage: number = 10;
  isChecked: Boolean;
  isStatusNull: boolean;
  observationType: any;
  actionExecutionTitle: string = 'Pending for execution';
  dateFormatDDMMYYYY = '';
  DoneTooltip: string;
  constructor(private actionTrackerService: ActiontrackerService,
    private baseService: BaseService,
    private hseErrorHandler: HseErrorHandlerService) {
    this.actiontrackerFilterData = new ActiontrackerFilter();
    this.DoneTooltip = ActiontrackerConstantsService.ToolTip.ExecuteAction;
  }

  ngOnInit() {
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.Routes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.setAllPrioritiesToCheckedForDefault();
    const loggedInUser = this.baseService.getItemFromSession(ActiontrackerConstantsService.ActiontrackerModuleConst.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.getProcess();
  }

  setAllPrioritiesToCheckedForDefault() {
    this.priorities = ActiontrackerConstantsService.Priority.Priority.filter(function (priority) {
      return priority.checked = true;
    });
    this.priorities.forEach(priority => {
      this.selectedPriority.push(priority.Id);
      this.filterList.push(priority.Priority);
    });
  }

  // To get process
  getProcess() {
    this.actionTrackerService.getProcess(this.callbackMethodForgetProcess.bind(this));
  }

  // call back method of get process
  callbackMethodForgetProcess(response) {
    this.processList = response.Result;
    this.processList.forEach(process => {
      if (process.ProcessName === ActiontrackerConstantsService.ActiontrackerModuleConst.Action) {
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
    this.actionTrackerService.getStatusByProcessId(apiRequest, this.callbackMethodForgetStatus.bind(this));
  }

  // call back method of get  status
  callbackMethodForgetStatus(response) {
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
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
      this.selectedStatus.push(localDefaultStatusId);
      this.filterList.push(localDefaultStatusName);
      response.Result.forEach(status => {
        if (status.StatusName === ActiontrackerConstantsService.Status.Open ||
          status.StatusName === ActiontrackerConstantsService.Status.Done) {
          this.iterableStatusList.push(status);
        }
      });
      this.getObservationTypeByCompanyId();
    }
  }

  // fetch the ation(s) from database by provided filters
  getActionsByFilters() {
    if (!this.actiontrackerFilterData.OrderdByColoumName) {
      this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    }
    if (!this.actiontrackerFilterData.OrderdBy) {
      this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.actiontrackerFilterData.PageSize = this.itemPerPage;
    this.actiontrackerFilterData.UserId = this.loggedInUserJSON.UserId;
    this.actiontrackerFilterData.PriorityTypes = this.selectedPriority;
    this.actiontrackerFilterData.StatusId = this.selectedStatus;
    const apiRequest = {
      Model: this.actiontrackerFilterData
    };
    this.actionTrackerService.getActionForActionPartyDashboard(apiRequest, this.callbackMethodForgetActionsByFilters.bind(this));
  }

  // call back method of get action by filter
  callbackMethodForgetActionsByFilters(response) {
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.actionData = response.Result;
      console.log(this.actionData);
      if (this.actionData.length < 10) {
        this.rowCount = this.rowCount - this.itemPerPage;
      }
      this.actionData.forEach(action => {
        this.priorities.forEach(priority => {
          if (action.Priority === priority.Id) {
            action.PriorityName = priority.Priority;
          }
          if (action.Status === ActiontrackerConstantsService.Status.Done) {
            action.Status = ActiontrackerConstantsService.Status.Completed;
          }
        });
      });
      this.actionData.forEach(action => {
        this.observationType.forEach(observation => {
          if (action.ObservationData.ObservationTypeId === observation.ObservationTypeId) {
            action.ObservationType = observation.ObservationTypeName;
          }
        });
      });

      this.actionData.map((action) => {
        if (action.Status === ActiontrackerConstantsService.Status.Open) {
          this.actionExecutionTitle = 'Pending for execution';
          action.UrlToRedirectByStatus = '/actiontracker/action-details';
        }
        if (action.Status === ActiontrackerConstantsService.Status.Done) {
          this.actionExecutionTitle = 'Execution completed actions';
          action.UrlToRedirectByStatus = '/actiontracker/action-execution-details';
        }
      });
    }
  }

  // check status filter
  changeValueStatus(event, status) {
    if (event.target.checked === true) {

      if (status.StatusName === ActiontrackerConstantsService.Status.Completed) {
        this.DoneTooltip = ActiontrackerConstantsService.ToolTip.DoneAction;
      } else {
        this.DoneTooltip = ActiontrackerConstantsService.ToolTip.ExecuteAction;

      }


      this.selectedStatus.push(status.StatusId);
      this.isSelectedStatusDone = false;
      this.filterList.push(status.StatusName);
    } else {
      const index = this.selectedStatus.indexOf(status.StatusId);
      const filterIndex = this.filterList.indexOf(status.StatusName);
      if (index > -1) {
        this.selectedStatus.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }
  // check priority filter
  changeValuePriority(event, priority) {
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
    this.selectedPriority = [];
    this.selectedStatus = [];
    this.filterList = [];
    for (const status in this.statusList) {
      if (this.statusList.hasOwnProperty(status)) {
        if (this.statusList[status].StatusName === ActiontrackerConstantsService.Status.Open) {
          this.statusList[status].checked = true;
          this.filterList.push(this.statusList[status].StatusName);
          this.selectedStatus.push(this.statusList[status].StatusId);
        } else {
          this.statusList[status].checked = false;
        }
      }
    } for (const priority in this.priorities) {
      if (this.priorities.hasOwnProperty(priority)) {
        this.priorities[priority].checked = true;
        this.selectedPriority.push(this.priorities[priority].Id);
        this.filterList.push(this.priorities[priority].Priority);
      }
    }
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

  getObservationTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'companyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.actionTrackerService.getObservationTypeByCompanyId(apiRequest, this.callbackMethodForGetObservationTypeDetails.bind(this));
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
    this.getActionsByFilters();
  }
  //#endregion
}

