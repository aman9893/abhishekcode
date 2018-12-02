import { Component, OnInit } from '@angular/core';
import { ObservationService } from '../../services/observation.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { BaseService } from '../../../shared/services/base.service';
import { ObservationConstantsService } from '../../services/observation-constants.service';
import { ObservationCardFilter } from '../../model/observationCardFilter.model';
import { Status } from '../../model/status.model';
import { ObservationRequest, ObservationRequsetsForDashboard } from '../../model/observationData.model';
import { Process } from '../../model/process.model';
import { UserType } from '../../../shared/models/user-type.model';

@Component({
  selector: 'app-past-observations',
  templateUrl: './past-observations.component.html',
  styleUrls: ['./past-observations.component.css']
})
export class PastObservationsComponent implements OnInit {
  observationFilterData: ObservationCardFilter;
  observationData: ObservationRequsetsForDashboard[];
  statusList: Status[];
  pageSize: number;
  rowCount: number;
  index: number;
  itemPerPage: number = 10;
  selectedStatus: number[] = [];
  loggedInUserJSON: any;
  processList: Process[] = [];
  filterList: string[] = [];
  isChecked: Boolean;
  isObservationTypeNull: boolean;
  selectedObservationType: number[] = [];
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  observationTypeDetailsResponse: any;
  ObservationFromDate: Date;
  ObservationToDate: Date;
  ObsSubmissionFromDate: Date;
  ObsSubmissionToDate: Date;
  requestType: string;
  showPagination: boolean = true;
  isRequestForDisplay: boolean = true;
  noRecordsMsg: string;
  defultStatus: string;
  selectedFilter: string;
  dateFormatDDMMYYYYHHMMSS = '';
  hideFilter: boolean;
  hideSort: boolean;
  deletedStatus: string;
  closedStatus: string;
  cancelledStatus: string;
  acknowledgedStatus: string;
  requestRaisedFor: string;
  userTypes: UserType[];
  userType: string;
 isHSEAdvisor: boolean = false;

  constructor(
    private observationService: ObservationService,
    private baseService: BaseService,
    private hseErrorHandlerService: HseErrorHandlerService) {
    this.hideFilter = true;
    this.hideSort = true;
    this.observationFilterData = new ObservationCardFilter();
    this.filterList.push(ObservationConstantsService.ObservationStatus.New);
    this.defultStatus = ObservationConstantsService.ObservationStatus.New;
    this.observationTypeDetailsResponse = [];
    // Set Flag as All Status
    this.deletedStatus = ConstantsService.Status.Deleted;
    this.acknowledgedStatus = ConstantsService.Status.Acknowledged;
    this.cancelledStatus = ConstantsService.Status.Cancelled;
    this.closedStatus = ConstantsService.Status.Closed;
  }

  ngOnInit() {
    this.baseService.showRootLoader = true;
    this.requestRaisedFor = ObservationConstantsService.RequestFor.Self;
    // Initailize instance of constant variable -  routeURL and route name
    this.routesFlag = ObservationConstantsService.ObservationNavigation.Routes;
    this.reportRoutes = ObservationConstantsService.ObservationNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    if (this.loggedInUserJSON.UserTypes.UserType === ObservationConstantsService.RequestFor.Contractor) {
      this.isRequestForDisplay = false;
    } else {
      // Default request type and display in filter list
      this.requestType = ObservationConstantsService.RequestFor.Self;
      this.filterList.push(this.requestType);
    }
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

    this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
    this.getUserTypes();
    this.setUserType();
    this.getProcess();
  }

  // get user type
  getUserTypes() {
    this.observationService.getUserTypes(this.callbackMethodForgetUserTypes.bind(this));
  }

  // call back mathod of get user type
  callbackMethodForgetUserTypes(response) {
    if (response.Error != null) {
      this.hseErrorHandlerService.handleError(response.Error);
    }

    if (response.Success) {
      this.userTypes = response.Result;
    }
  }

  onClickedOutside() {
    this.hideFilter = false;
    this.hideSort = false;
  }

  onTabOpen() {
    this.hideFilter = true;
    this.hideSort = true;
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
      this.observationTypeDetailsResponse = response.Result;
      this.observationTypeDetailsResponse.forEach((item) => {
        item['Checked'] = true;
      });
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.setUserType();
    this.getObservationData();
  }
  //#endregion

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

  // to get observation data
  getObservationData() {
    this.setUserType();
    if (!this.selectedStatus.length) {
      for (let index = 0; index < this.statusList.length; index++) {
        if (this.statusList[index].StatusName === ObservationConstantsService.Status.New) {
          this.selectedStatus.push(this.statusList[index].StatusId);
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
      for (let index = 0; index < this.observationTypeDetailsResponse.length; index++) {
        this.selectedObservationType.push(this.observationTypeDetailsResponse[index].ObservationTypeId);
        this.isObservationTypeNull = false;
      }
    }
    if (!this.rowCount) {
      this.rowCount = this.itemPerPage * 2;
    }
    this.observationFilterData.PageSize = this.itemPerPage;
    this.observationFilterData.EmployeeId = this.loggedInUserJSON.UserId;
    this.observationFilterData.Observationtypes = this.selectedObservationType;
    this.observationFilterData.Status = this.selectedStatus;
    this.observationFilterData.UserType = this.userType;
    if (this.observationFilterData) {
      const apiRequest = {
        Model: this.observationFilterData
      };
      // Get observation requests for dashboard
      this.observationService.getObservationRequestsForDashboard(apiRequest, this.callbackMethodForGetObservationData.bind(this));
    }
  }

  // call back method of submit observation
  callbackMethodForGetObservationData(response) {
    this.baseService.showRootLoader = false;
    this.showPagination = true;
    this.observationData = response.Result;
    this.observationTypeDetailsResponse.forEach((obsTypeObject) => {
      this.observationData.forEach((obsData) => {
        if (obsData.ObservationRequests.ObservationTypeId === obsTypeObject.ObservationTypeId) {
          obsData.ObservationRequests.ObservationType = obsTypeObject.ObservationTypeName;
        }
      });
    });
    if (this.requestRaisedFor === ObservationConstantsService.RequestFor.Self) {
      this.observationData = this.observationData.filter(observation => {
        if (this.loggedInUserJSON.UserId === observation.ObservationRequests.RaisedFor) {
          return observation;
        }
      });
    }

    if (this.requestRaisedFor === ObservationConstantsService.RequestFor.OnBehalf) {
      this.observationData = this.observationData.filter(observation => {
        if (this.loggedInUserJSON.UserId !== observation.ObservationRequests.RaisedFor) {
          return observation;
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

  // call back method of submit observation
  callbackMethodForgetStatus(response) {
    if (response.Errors != null) {
      // this.hseErrorHandler.handleError(response.Errors);
    }
    if (response.Success) {
      this.statusList = response.Result;
    }
    this.getObservationTypeByCompanyId();
  }

  // Selected Status for filter
  submitSelectedStatus(statusDetails, event): void {
    // set value of selected filter
    this.selectedFilter = statusDetails.StatusName;
    if (event.target.checked) {
      this.selectedStatus = [];
      this.selectedStatus.push(statusDetails.StatusId);
      this.filterList = [];
      this.filterList.push(statusDetails.StatusName);
      // set default filter
      this.filterList.push(this.requestRaisedFor);
    }
    // Get Observation Data based on selected filter
    this.getObservationData();
  }

  // check observation type filter
  selectObservationType(value, observationType) {
    if (this.isObservationTypeNull === false) {
      this.selectedObservationType = [];
    }
    if (value === true) {
      this.isObservationTypeNull = true;
      this.observationTypeDetailsResponse.forEach((item) => {
        // check and set value of checkbox of observation type
        if (item.ObservationTypeName === observationType.ObservationTypeName) {
          item['Checked'] = value;
        }
      });
      this.selectedObservationType.push(observationType.ObservationTypeId);
      this.filterList.push(observationType.ObservationTypeName);
    } else {
      const index = this.selectedObservationType.indexOf(observationType.ObservationTypeId);
      const filterIndex = this.filterList.indexOf(observationType.ObservationTypeName);
      if (index > -1) {
        this.selectedObservationType.splice(index, 1);
        this.filterList.splice(filterIndex, 1);
      }
    }
  }

  // check DESC observation date data
  descObservationDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.ObservationDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    this.getObservationData();
  }

  //  check ASC observation date data
  ascObservationDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.ObservationDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.ASC;
    this.getObservationData();
  }

  //  check DESC Submit date data
  descSubmissionDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.DESC;
    this.getObservationData();
  }

  //  check ASC Submit date data
  ascSubmissionDate() {
    this.observationFilterData.OrderdByColoumName = ObservationConstantsService.ObservationCardModuleConst.SubmitDate;
    this.observationFilterData.OrderdBy = ObservationConstantsService.ObservationCardModuleConst.ASC;
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
    // reset Date Filter
    this.ObservationFromDate = null;
    this.ObservationToDate = null;
    this.ObsSubmissionFromDate = null;
    this.ObsSubmissionToDate = null;
    this.selectedFilter = null;
    // Set status as New
    this.defultStatus = ObservationConstantsService.ObservationStatus.New;
    this.observationFilterData = new ObservationCardFilter();
    this.filterList = [];
    // By defualt Status filter as 'New'
    this.filterList.push(ObservationConstantsService.ObservationStatus.New);
    // reset request Type
    this.requestType = ObservationConstantsService.RequestFor.Self;
    this.filterList.push(this.requestType);
    this.selectedStatus = [];
    this.selectedObservationType = [];
    this.getObservationData();
  }

  // to get selected observation id
  selectedObservationRequestId(Id) {
    this.observationService.getSelectedObservationRequestId(Id);
  }

  // Save Request type into filter List
  saveRequestToFilterList(event) {
    this.filterList = [];
    // this.filterList.push(ObservationConstantsService.ObservationStatus.New);
    // this.filterList.push(this.requestRaisedFor);
    if (event.target.checked) {
      this.requestRaisedFor = event.target.value;
      this.filterList.push(this.requestRaisedFor);
      this.setUserType();
      this.getObservationData();
    }
  }

  setUserType() {
    switch (this.requestRaisedFor) {
      case ObservationConstantsService.RequestFor.Self:
        if (this.userTypes) {
          this.userTypes.forEach(userType => {
            if (this.loggedInUserJSON.UserTypes.UserTypeId === userType.UserTypeId) {
              this.userType = userType.UserType;
            }
          });
        }
        break;
      case ObservationConstantsService.RequestFor.OnBehalf:
        this.userType = ConstantsService.authenticationType.Employee;
        break;
      case ObservationConstantsService.RequestFor.Contractor:
        this.userType = ConstantsService.authenticationType.Contractor;
        break;
    }
  }
}


