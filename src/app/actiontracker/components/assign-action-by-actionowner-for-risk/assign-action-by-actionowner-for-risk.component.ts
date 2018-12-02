import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActiontrackerConstantsService } from '../../services/actiontracker-constants.service';
import { RiskConstantsService } from './../../../risk/services/risk-constants.service';
import { ActiontrackerService } from './../../services/actiontracker.service';

import { ActionGet } from './../../model/actionGet';
import { User } from '../../model/user.model';
import { Status } from '../../../observation/model/status.model';
import { Priority } from './../../model/priority.model';

@Component({
  selector: 'app-assign-action-by-actionowner-for-risk',
  templateUrl: './assign-action-by-actionowner-for-risk.component.html',
  styleUrls: ['./assign-action-by-actionowner-for-risk.component.css']
})
export class AssignActionByActionownerForRiskComponent implements OnInit {
  riskRequestId: number;
  actionId: number;
  actionDetailsForRisk: ActionGet;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  backToDashboardFlag: boolean;
  priorityName: string;
  priorities: Priority[];

  constructor(private route: ActivatedRoute,
    private actiontrackerService: ActiontrackerService) {
    this.actionDetailsForRisk = new ActionGet();
    this.actionDetailsForRisk.ActionOwner = new User();
    this.actionDetailsForRisk.Status = new Status();
  }

  ngOnInit() {
    // Back to Dashboard flag to display confirmation box
    this.backToDashboardFlag = true;
    // Set routeURL and route name for reports and action
    this.routesFlag = ActiontrackerConstantsService.ActiontrackerNavigation.InnerRoutes;
    this.reportRoutes = ActiontrackerConstantsService.ActiontrackerNavigation.ReportRoutes;
    // Set Priorities
    this.priorities = ActiontrackerConstantsService.Priority.Priority;
    // Get risk request Id and action Id from query/route param
    this.route.params.subscribe(params => {
      this.riskRequestId = +params[RiskConstantsService.RiskRequest.RiskRequestId];
      this.actionId = +params[ActiontrackerConstantsService.ActiontrackerModuleConst.actionId];
    });

    // get action details against risk request id
    this.getActionDetailsForRiskRequestByActionId();
  }

  //#region - Get Action details for risk requests
  /**
    * Get Action details for risk requests by action id
    */
  getActionDetailsForRiskRequestByActionId() {
    const apiRequest = {
      Model: {
        ActionId: this.actionId
      }
    };
    this.actiontrackerService.getActionDetailsForRiskRequestByActionId(apiRequest,
      this.callbackMethodGetActionDetailsForRiskByActionId.bind(this));
  }

  // call back method to get the action details for risk requests
  callbackMethodGetActionDetailsForRiskByActionId(response) {
    if (response && response.Result && response.Success) {
      this.actionDetailsForRisk = response.Result;
      // Set Priority Name
      this.priorities.forEach(priority => {
        if (this.actionDetailsForRisk.Priority === priority.Id) {
          this.priorityName = priority.Priority;
        }
      });
    }
  }
  //#endregion
}

