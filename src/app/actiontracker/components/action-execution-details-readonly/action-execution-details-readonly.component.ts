import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../../../shared/services/base.service';
import { ActiontrackerService } from '../../services/actiontracker.service';
import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { ActionGet } from '../../model/actionGet';
import { UploadedDocument } from '../../model/uploadedDocument.model';
import { ActionAssignment } from '../../model/actionAssignment.model';
import { Priority } from '../../model/priority.model';

@Component({
  selector: 'app-action-execution-details-readonly',
  templateUrl: './action-execution-details-readonly.component.html',
  styleUrls: ['./action-execution-details-readonly.component.css']
})
export class ActionExecutionDetailsReadonlyComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  actionId: number;
  actionGet: ActionGet;
  loggedInUserJSON: any;
  uploadedDoucment: UploadedDocument[];
  actionAssignmentDetails: ActionAssignment;
  dateFormatDDMMYYYY = '';
  constructor(
    private activateRoute: ActivatedRoute,
    private actionTrackerService: ActiontrackerService,
    private hseErrorHandlerService: HseErrorHandlerService,
    private baseService: BaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.InnerRoutes;
    this.reportRoutes =  ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.dateFormatDDMMYYYY = this.baseService.dateFormatDDMMYYYY;
    this.actionGet = new ActionGet;
    this.actionAssignmentDetails = new ActionAssignment;
    this.activateRoute.params.subscribe(params => {
      this.actionId = +params['actionId'];
    });
    this.getActionGetModelById();
  }

  // To get action details by action id
  getActionGetModelById() {
    const apiRequest = {
      Model: {
        ActionId: this.actionId
      }
    };
    this.actionTrackerService.getActionGetModelById(apiRequest, this.callbackMethodForGetActionGetModelById.bind(this));
  }

  // callback method for getActionGetModelById
  callbackMethodForGetActionGetModelById(response) {
    if (response.Error != null) {
      this.hseErrorHandlerService.handleError(response.Error);
    }
    if (response.Success) {
      this.actionGet = response.Result;
      this.getActionAssignmentDetailsByUserId();
      this.getUploadedDocumentDetailsByUserId();
    }
  }

  // Method to extract actin assignment details according to UserId
  getActionAssignmentDetailsByUserId() {
    this.actionAssignmentDetails = this.actionGet.ActionAssignment.find(actionAssignment =>
      actionAssignment.UpdatedBy === this.loggedInUserJSON.UserId);
  }

  // Method to extract uploaded document details according to UserId
  getUploadedDocumentDetailsByUserId() {
    this.uploadedDoucment = this.actionGet.UploadedDocument.filter(uploadedDoucment => {
      if (uploadedDoucment.UploadedBy === this.loggedInUserJSON.UserId) {
        return uploadedDoucment;
      }
    });
  }

  // Redirect to dashboard with user confirmation
  onClickBackToDashboard() {
    this.router.navigate([ActiontrackerConstantsService.RoutingURLConstant.ActionPartyDashboardURL]);
  }
}
