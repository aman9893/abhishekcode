import { ActiontrackerConstantsService } from './../../services/actiontracker-constants.service';
import { ActionAssign } from './../../model/actionAssign.model';
import { Component, OnInit } from '@angular/core';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { Action } from '../../model/action.model';
import { User } from '../../model/user.model';
import { ActiontrackerFilter } from '../../model/actiontrackerFilter.model';
import { Status } from '../../model/status.model';
import { Process } from '../../model/process.model';
import { BaseService } from '../../../shared/services/base.service';
import { concat } from 'rxjs/operators';
import { ReportModule } from '../../../report/report.module';


@Component({
  selector: 'app-verifier-dashboard',
  templateUrl: './verifier-dashboard.component.html',
  styleUrls: ['./verifier-dashboard.component.css']
})
export class VerifierDashboardComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  loggedInUserJSON: any;
  actiontrackerFilterData: ActiontrackerFilter;
  actionData: Action[] = [];
  actionAssignedByUserData: User;
  isSelectedSourceTypeFull: boolean;
  isSelectedStatusDone: boolean;
  selectedSourceType: number[] = [];
  selectedStatus: number[] = [];
  filterList: string[] = [];
  iterableStatusList: Status[] = [];
  statusList: Status;
  processList: Process[] = [];
  processes: Process[] = [];
  pageSize: number;
  rowCount: number;
  index: number;
  itemPerPage: number = 10;
  isChecked: Boolean;
  isStatusNull: boolean;
  hideFilter: boolean;
  hideSort: boolean;
  status: Status[];
  defaultstatus: string;
  viewtooltip: string;
  uniqueSourceTypeFilterList: string[];
  constructor(private actionTrackerService: ActiontrackerService,
    private baseService: BaseService,
    private hseErrorHandler: HseErrorHandlerService) {
    this.actiontrackerFilterData = new ActiontrackerFilter();
    this.filterList.push(ActiontrackerConstantsService.Status.Done);

    this.defaultstatus = ActiontrackerConstantsService.Status.Done;
    this.viewtooltip = ActiontrackerConstantsService.ToolTip.VerifyAction;
    this.hideFilter = true;
    this.hideSort = true;
    this.uniqueSourceTypeFilterList = [];
  }

  ngOnInit() {
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.Routes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession(ActiontrackerConstantsService.ActiontrackerModuleConst.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.getProcess();
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
      this.iterableStatusList = response.Result;
      response.Result = response.Result.concat(ActiontrackerConstantsService.StatusList);
      this.statusList = response.Result.filter(function(status) {
        if (status.StatusName === ActiontrackerConstantsService.Status.Done ||
          status.StatusName === ActiontrackerConstantsService.Status.Accepted ||
          status.StatusName === ActiontrackerConstantsService.Status.Rejected  ) {

          return status;

        }


      });

      this.getActionsByFilters();
    }
  }

  // fetch the ation(s) from database by provided filters
  getActionsByFilters() {
    if (this.selectedStatus.length === 0) {
      this.iterableStatusList.forEach(status => {
        if (status.StatusName === ActiontrackerConstantsService.ActiontrackerModuleConst.Done) {
          this.selectedStatus.push(status.StatusId);
          this.isSelectedStatusDone = true;
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
      this.processes.forEach(process => {
        this.selectedSourceType.push(process.ProcessId);
        this.isSelectedSourceTypeFull = true;
      });
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.actiontrackerFilterData.PageSize = this.itemPerPage;
    this.actiontrackerFilterData.UserId = this.loggedInUserJSON.UserId;
    this.actiontrackerFilterData.ProcessIds = this.selectedSourceType;
    this.actiontrackerFilterData.StatusId = this.selectedStatus;
    const apiRequest = {
      Model: this.actiontrackerFilterData
    };
    this.actionTrackerService.getActionForVerifierDashboard(apiRequest, this.callbackMethodForgetActionsByFilters.bind(this));
  }

  // call back method of get action by filter
  callbackMethodForgetActionsByFilters(response) {
    if (response.Errors != null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.actionData = response.Result;
      if (this.actionData.length < 10) {
        this.rowCount = this.rowCount - this.itemPerPage;
      }
      this.actionData.forEach(action => {
        const createdDate = new Date(action.CreatedDate);
        const targetDate = new Date(action.TargetDate);
        this.processList.forEach(process => {
          if (process.ProcessId === action.Source) {
            action.SourceText = process.ProcessName;
          }
        });
      });
    }
  }

  // check source type filter
  changeValueSourceType(event, process) {
    if (this.isSelectedSourceTypeFull === true) {
      this.selectedSourceType = [];
    }
    if (event.target.checked === true) {
      this.selectedSourceType.push(process.ProcessId);
      this.isSelectedSourceTypeFull = false;
      this.uniqueSourceTypeFilterList.push(process.ProcessName);
      this.filterList.push(process.ProcessName);
    } else {
      const index = this.selectedSourceType.indexOf(process.ProcessId);
      const filterIndex = this.filterList.indexOf(process.ProcessName);
      const uniquefilterIndex = this.uniqueSourceTypeFilterList.indexOf(process.ProcessName);
      if (index > -1) {
        this.selectedSourceType.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
      if (uniquefilterIndex > -1) {
        // this.selectedObservationType.splice(index, 1);
        this.uniqueSourceTypeFilterList.splice(uniquefilterIndex, 1);
      }
    }
  }

  // check status filter
  changeValueStatus(event, status) {
    if (this.isSelectedStatusDone === true) {
      this.selectedStatus = [];
    }
    if (status.StatusName === ActiontrackerConstantsService.Status.Closed) {
      this.viewtooltip = ActiontrackerConstantsService.ToolTip.DoneAction;
    }
    if (event.target.checked === true) {
      this.selectedStatus = [];
      this.selectedStatus.push(status.StatusId);
      this.isSelectedStatusDone = false;
      this.filterList = [];
      this.filterList.push(status.StatusName);
      if (this.uniqueSourceTypeFilterList.length > 0) {
        // this.filterList = (this.uniqueObservationTypeFilterList).slice();
        this.filterList.push.apply(this.filterList, this.uniqueSourceTypeFilterList);
      }
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

  // all the filter are applied
  doneFilter() {
    this.getActionsByFilters();
  }

  // reset all the filter
  reset() {
    for (const status in this.statusList) {
      if (this.statusList.hasOwnProperty(status)) {
        this.statusList[status].checked = true;
      }
    }
    for (const process in this.processes) {
      if (this.processes.hasOwnProperty(process)) {
        this.processes[process].checked = true;
      }
    }
    this.defaultstatus = ActiontrackerConstantsService.Status.Done;
    this.filterList = [];
    this.filterList.push(ActiontrackerConstantsService.Status.Done);
    this.selectedSourceType = [];
    this.selectedStatus = [];
    this.uniqueSourceTypeFilterList = [];
     this.rowCount = this.itemPerPage * 2;
    this.getActionsByFilters();
  }

  // check DESC Created date data
  descActionAssignDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.ASC;
    this.getActionsByFilters();
  }

  //  check ASC Created date data
  ascActionAssignDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.CreatedDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
    this.getActionsByFilters();
  }

  //  check DESC Target date data
  descActionDueDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.TargetDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.ASC;
    this.getActionsByFilters();
  }

  //  check ASC Target date data
  ascActionDueDate() {
    this.actiontrackerFilterData.OrderdByColoumName = ActiontrackerConstantsService.ActiontrackerModuleConst.TargetDate;
    this.actiontrackerFilterData.OrderdBy = ActiontrackerConstantsService.ActiontrackerModuleConst.DESC;
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

  // close the filter
  closeFilter(value) {
    const filterIndex = this.filterList.indexOf(value);
    if (filterIndex > -1) {
      this.filterList.splice(filterIndex, 1);
    }
    for (let index = 0; index < this.iterableStatusList.length; index++) {
      if (this.iterableStatusList[index].StatusName === value) {
        const statusndex = this.selectedStatus.indexOf(this.iterableStatusList[index].StatusId);
        if (statusndex > -1) {
          this.selectedStatus.splice(statusndex, 1);
          if (this.statusList.hasOwnProperty(index)) {
            this.statusList[index].checked = false;
          }
        }
      }
    }
    for (let index = 0; index < this.processes.length; index++) {
      if (this.processes[index].ProcessName === value) {
        const processindex = this.selectedSourceType.indexOf(this.processes[index].ProcessId);
        if (processindex > -1) {
          this.selectedSourceType.splice(processindex, 1);
          if (this.processes.hasOwnProperty(index)) {
            this.processes[index].checked = false;
          }
        }
      }
    }
    this.getActionsByFilters();
  }

  onClickedOutside() {
    this.hideFilter = false;
    this.hideSort = false;
  }

  onTabOpen() {
    this.hideFilter = true;
    this.hideSort = true;
  }
}
