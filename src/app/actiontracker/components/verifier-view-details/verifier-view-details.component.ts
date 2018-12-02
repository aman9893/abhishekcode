import { Status } from './../../../observation/model/status.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActiontrackerService } from '../../services/actiontracker.service';
import { ActionGet } from './../../model/actionGet';
import { BaseService } from './../../../shared/services/base.service';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';

import { Process } from '../../model/process.model';

@Component({
  selector: 'app-verifier-view-details',
  templateUrl: './verifier-view-details.component.html',
  styleUrls: ['./verifier-view-details.component.css']
})
export class VerifierViewDetailsComponent implements OnInit {
  selectedActionId: any;
  verificationDate: Date;
  verifierRemark: string;
  acceptedStatus: string;
  rejectedStatus: string;
  actionDetails: any;
  successDetails: string;
  errorDetails: string;
  alertType: string;
  display: boolean = false;
  priority: string = '';
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  showRemarkErrorMessage: boolean = false;
  currentDate = new Date();
  dateFormatDDMMYYYY = '';
  processList: Process[] = [];
  processId: number;
  toggleImage: boolean = false;
  actionHistoryRemarksForDocs: string;

  constructor(private route: ActivatedRoute,
    private actionTrackerService: ActiontrackerService,
    private actiontrackerConstantService: ActiontrackerConstantsService,
    private router: Router,
    private baseService: BaseService,
    private hseErrorHandlerService: HseErrorHandlerService) { }

  ngOnInit() {
    this.actionDetails = new ActionGet();
    this.verificationDate = new Date();
    this.acceptedStatus = ActiontrackerConstantsService.Status.Accepted;
    this.rejectedStatus = ActiontrackerConstantsService.Status.Rejected;
    this.verifierRemark = '';
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.InnerRoutes;
    this.reportRoutes =  ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    this.route.params.subscribe(params => {
      this.selectedActionId = + params['actionId'];
    });
    this.getProcess();
  }

  //#region -  To get process based on process name
  getProcess() {
    this.actionTrackerService.getProcess(this.callbackMethodForgetProcess.bind(this));
  }

  // call back method of get process
  callbackMethodForgetProcess(response) {
    if (response.Error != null) {
      this.hseErrorHandlerService.handleError(response.Error);
    }
    if (response.Success) {
      this.processList = response.Result;
      this.processList.forEach(process => {
        if (process.ProcessName === 'Action') {
          this.processId = process.ProcessId;
          // Get Action Details based on action id and processId
          this.getActionGetModelByActionId();
        }
      });
    }
  }
  //#endregion

  //#region - Get Action details based on action Id and Process Id
  getActionGetModelByActionId() {
    const apiRequest = {
      Model: {
        ActionId: this.selectedActionId,
        ProcessId: this.processId
      }
    };
    this.actionTrackerService.getActionGetModelById(apiRequest, this.getActionGetModelByIdSuccess.bind(this));
  }
  getActionGetModelByIdSuccess(response) {
    if (response && response.Result) {
      this.actionDetails = response.Result;
      const actionHistoryDetails = response.Result.ActionAssignment;
      // Get History remarks for file uploaded docs
      actionHistoryDetails.filter((item) => {
        if (item.Status === ActiontrackerConstantsService.Status.Done) {
          this.actionHistoryRemarksForDocs = item.Remarks;
        }
      });
      ActiontrackerConstantsService.Priority.Priority.forEach(priority => {
        if (this.actionDetails.Priority === priority.Id) {
          this.priority = priority.Priority;
        }
      });
      console.log(this.actionDetails);
    }
  }
  //#endregion

  submitVerifierAction(status) {
    // Check if user rejects then comment is mandatory
    if (status === ActiontrackerConstantsService.Status.Rejected) {
      if (!this.verifierRemark) {
        this.showRemarkErrorMessage = true;
      } else {
        this.showRemarkErrorMessage = false;
      }
    } else {
      this.showRemarkErrorMessage = false;
    }

    if (!this.showRemarkErrorMessage) {
      const apiRequest = {
        Model: {
          ActionId: this.selectedActionId,
          VerificationDate: this.verificationDate,
          Remarks: this.verifierRemark,
          Status: status
        }
      };

      this.actionTrackerService.submitVerifierAction(apiRequest, this.submitVerifierActionSuccess.bind(this));
    }
  }

  submitVerifierActionSuccess(response) {
    if (response && response.Result === true) {
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Action details has been saved successfully.';
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = 'Error while saving action details, please try after some time.';
    }
    this.display = true;
  }

  backToVerifierDashboard() {
    this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionVerifierDashboardURL]);
  }

  //#region- display image on hover of image
  displayImage($event) {
    this.toggleImage = $event.type === 'mouseenter' ? true : false;
  }
  //#endregion
}

