import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RiskConstantsService } from './../../services/risk-constants.service';
import { BaseService } from './../../../shared/services/base.service';
import { RiskService } from './../../services/risk.service';
import { ConstantsService } from '../../../shared/services/constants.service';

@Component({
  selector: 'app-close-risk-request',
  templateUrl: './close-risk-request.component.html',
  styleUrls: ['./close-risk-request.component.css']
})
export class CloseRiskRequestComponent implements OnInit {
  riskRequestId: number;
  backToDashboardFlag: boolean;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  displayActionDetails: boolean = true;
  displayRiskDetails: boolean = true;
  completedActionDetails: any;
  closureDetails: string;
  validationOnReason: boolean = false;
  successDetails: string;
  errorDetails: any;
  alertType: string;

  constructor(private route: ActivatedRoute,
    private baseService: BaseService,
    private riskService: RiskService,
    private router: Router) { }

  ngOnInit() {
    this.baseService.showRootLoader = true;
    // Back to Dashboard flag to display confirmation box
    this.backToDashboardFlag = false;
    // Set routeURL and route name for Risk
    this.routesFlag = RiskConstantsService.RiskNavigation.InnerRoutes;
    this.reportRoutes = RiskConstantsService.RiskNavigation.ReportRoutes;
    // Get risk request Id and action Id from query/route param
    this.route.params.subscribe(params => {
      this.riskRequestId = +params[RiskConstantsService.RiskRequest.RiskRequestId];
    });
    this.baseService.showRootLoader = false;
  }

  //#region - Get Completed Action by Risk-ID/ Source ID
  getCompletedAction() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        RiskSourceId: this.riskRequestId
      }
    };
    this.riskService.GetCompletedActionByRiskId(apiRequest, this.callbackToGetActionDetails.bind(this));
  }

  callbackToGetActionDetails(response) {
    this.baseService.showRootLoader = false;
    if (response) {
      this.completedActionDetails = response.Result;
    }
  }
  //#endregion

  //#region- Close Risk Request by risk request id for completed action
  closeRiskRequest() {
    if (this.closureDetails) {
      this.baseService.showRootLoader = true;
      const apiRequest = {
        Model: {
          RiskSourceId: this.riskRequestId,
          ClosureRemarks: this.closureDetails
        }
      };
      this.riskService.CloseRiskRequestByRiskId(apiRequest, this.callbackToCloseRiskRequestByRiskId.bind(this));
    } else {
      this.validationOnReason = true;
    }
  }

  callbackToCloseRiskRequestByRiskId(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Risk request closed successfully';
    } else {
      const countOfOpenAction = response.Result;
      this.alertType = ConstantsService.Error;
      this.errorDetails = [{
        'Message': 'You can not close risk request because ' + countOfOpenAction + ' Action pending with action owner.'
      }];
    }
  }
  //#endregion

  // check validation for field
  onSearchChange() {
    if (this.closureDetails) {
      this.validationOnReason = false;
    } else {
      this.validationOnReason = true;
    }
  }

  //#region - Pop up section
  onYesClickedSuccess() {
    this.alertType = '';
    this.successDetails = '';
    this.errorDetails = '';
    this.router.navigate([RiskConstantsService.RedirectUrls.MyRiskRequest]);
  }
  //#endregion
}
