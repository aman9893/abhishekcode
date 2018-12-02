import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { ObservationService } from '../../services/observation.service';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { BaseService } from '../../../shared/services/base.service';
import { ObservationType } from '../../model/observationType.model';
import { Process } from '../../model/process.model';
import { Status } from '../../model/status.model';
import { ObservationStatusFilter } from '../../model/observationStatusFilter.model';
import { ObservationStatusReport } from '../../model/observationStatusReport.model';
import { Action } from '../../../actiontracker/model/action.model';
import { Priority } from '../../../actiontracker/model/priority.model';
import { ActiontrackerConstantsService } from '../../../actiontracker/services/actiontracker-constants.service';

@Component({
  selector: 'app-observation-status-report',
  templateUrl: './observation-status-report.component.html',
  styleUrls: ['./observation-status-report.component.css']
})
export class ObservationStatusReportComponent implements OnInit {
  observationTypeList: { label: string; value: string }[] = [];
  statusList: { label: string; value: string }[] = [];
  status: Status[];
  noRecordsMsg: string;
  priorities: Priority[];
  rowCount: number;
   dateFormatDDMMYYYYHHMMSS = '';
  showPagination: boolean = true;
  pageSize: number;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  itemPerPage: number = 10;
  observationStatusReports: ObservationStatusReport[];
  observationStatusFilter: ObservationStatusFilter;
  selectedObservationType: string[] = [];
  selectedStatus: string[] = [];
  selectedObservationTypeId: number[] = [];
  selectedStatusId: number[] = [];
  loggedInUserJSON: any;
  processList: Process[] = [];
  observationFromdate: Date;
  observationTodate: Date;
  submissionFromdate: Date;
  submissionTodate: Date;
  actions: Action[];
   isHSEAdvisor: boolean = false;
  observationType: ObservationType[];
  constructor(private observationService: ObservationService,
              private router: Router,
    private baseService: BaseService) { }

  ngOnInit() {
    this.routesFlag = ObservationConstantsService.ObservationNavigation.Routes;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
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
    this.priorities = ActiontrackerConstantsService.Priority.Priority;
    this.observationStatusFilter = new ObservationStatusFilter();
     this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
    this.getProcess();
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
    if (response.Errors != null) {
      // this.hseErrorHandler.handleError(response.Errors);
    }
    if (response && response.Success) {
      this.status = response.Result;
      this.statusList = this.status.map(statusvalue => {
        return { label: statusvalue.StatusName, value: statusvalue.StatusName };
      });
      for (let index = 0; index < this.statusList.length; index++) {
        if (this.statusList[index].label !== ObservationConstantsService.Status.Deleted
          && this.statusList[index].label !== ObservationConstantsService.Status.Acknowledged &&
          this.statusList[index].label !== ObservationConstantsService.Status.Closed) {
          this.statusList.splice(index, 1);
          index--;
        }
      }
      ObservationConstantsService.MultiSelectStatus.forEach(multiSelectStatus => {
        this.statusList.push(multiSelectStatus);
      });
      this.getObservationTypeByCompanyId();
    }
  }

  getObservationTypeByCompanyId() {
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    const apiRequest = {
      Model: {
        'companyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.observationService.getObservationTypeByCompanyId(apiRequest, this.callbackMethodForGetObservationTypeDetails.bind(this));
  }

  // call back method of getObservationTypeByCompanyId
  callbackMethodForGetObservationTypeDetails(response) {
    if (response && response.Success) {
      this.observationType = response.Result;
      this.observationTypeList = this.observationType.map(observationtype => {
        return { label: observationtype.ObservationTypeName, value: observationtype.ObservationTypeName };
      });
    } else {
      this.baseService.processApiResponseError(response);
    }
  }

  getServerData(event) {
    if (event === 1) {
      this.observationStatusFilter.PageIndex = 0;
    } else {
      this.observationStatusFilter.PageIndex = ((event * this.itemPerPage) - this.itemPerPage);
      this.rowCount = ((event + 1) * this.itemPerPage);
    }
    this.pageSize = event;
    this.generateReport();
  }
  generateReport() {
    this.selectedStatusId = [];
    this.selectedObservationTypeId = [];
    this.status.forEach(statusvalue => {
      this.selectedStatus.forEach(selectedstatus => {
        if (statusvalue.StatusName === selectedstatus) {
          this.selectedStatusId.push(statusvalue.StatusId);
        }
      });
    });
    this.selectedStatus.forEach(selectedstatus => {
      if (selectedstatus === ObservationConstantsService.ObservationStatus.Submitted) {
        this.status.forEach(statusvalue => {
          if (statusvalue.StatusName === ObservationConstantsService.Status.New) {
            this.selectedStatusId.push(statusvalue.StatusId);
          }
        });
      }
    });
    this.observationType.forEach(observationtypevalue => {
      this.selectedObservationType.forEach(selectedobservationtype => {
        if (observationtypevalue.ObservationTypeName === selectedobservationtype) {
          this.selectedObservationTypeId.push(observationtypevalue.ObservationTypeId);
        }
      });
    });
    if (!this.observationStatusFilter.PageIndex) {
      this.observationStatusFilter.PageIndex = 0;
    }
     if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    if (!this.observationStatusFilter.PageSize) {
      this.observationStatusFilter.PageSize = 10;
    }
    this.observationStatusFilter.StatusIds = this.selectedStatusId;
    this.observationStatusFilter.Observationtypes = this.selectedObservationTypeId;
    this.observationStatusFilter.ObservationFromDate = this.observationFromdate;
    this.observationStatusFilter.ObservationToDate = this.observationTodate;
    this.observationStatusFilter.ObservationSubmissionFromDate = this.submissionFromdate;
    this.observationStatusFilter.ObservationSubmissionToDate = this.submissionTodate;
    if (this.observationStatusFilter) {
      const apiRequest = {
        Model: this.observationStatusFilter
      };
      // Get observation requests for dashboard
      this.observationService.GetObservationStatusReport(apiRequest, this.callbackMethodForGetObservationStatusReport.bind(this));
    }
  }
  callbackMethodForGetObservationStatusReport(response) {
    this.observationStatusReports = response.Result;
    this.observationStatusReports.forEach(observationStatusReport => {
      if (observationStatusReport.RaisedBy === observationStatusReport.RaisedFor) {
        observationStatusReport.RaisedByValue = ObservationConstantsService.RequestFor.Self;
         observationStatusReport.OnBehalfUserName = ObservationConstantsService.ObservationCardModuleConst.NA;
      } else {
        observationStatusReport.RaisedByValue = ObservationConstantsService.RequestFor.OnBehalf;
      }
       });
    if (!response.Result || response.Result.length < this.itemPerPage) {
      this.rowCount = this.rowCount - this.itemPerPage;
    }
    if (response.Success) {
      if (response.Result.length === 0) {
        this.showPagination = false;
        this.noRecordsMsg = 'No records found!';
      } else {
        this.showPagination = true;
      }
    }
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

  exportToExcel() {
    const apiRequest = {
      Model: this.observationStatusFilter
    };
    // Get all observation type data
    this.observationService.exportToExcel(apiRequest, this.callbackMethodForExportToExcel.bind(this));
  }

  callbackMethodForExportToExcel(response) {

  }

  resetValue() {
    this.selectedStatus = [];
    this.selectedObservationType = [];
    this.observationFromdate  = null;
   this.observationTodate  = null ;
   this.submissionFromdate  = null ;
   this.submissionTodate  = null ;
  }

  onClickBack() {
    this.router.navigate([ObservationConstantsService.RoutingURLConstant.ObservationCardURL]);
  }
}
