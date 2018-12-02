import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RiskConstantsService } from './../../services/risk-constants.service';
import { BaseService } from './../../../shared/services/base.service';
import { RiskService } from './../../services/risk.service';
import { ConstantsService } from '../../../shared/services/constants.service';

@Component({
  selector: 'app-view-residual-risks',
  templateUrl: './view-residual-risks.component.html',
  styleUrls: ['./view-residual-risks.component.css']
})
export class ViewResidualRisksComponent implements OnInit {
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  riskRequestId: number;

  constructor(private route: ActivatedRoute,
    private baseService: BaseService,
    private riskService: RiskService,
    private router: Router) { }

  ngOnInit() {
    this.baseService.showRootLoader = true;
    // Set routeURL and route name for Risk
    this.routesFlag = RiskConstantsService.RiskNavigation.InnerRoutes;
    this.reportRoutes = RiskConstantsService.RiskNavigation.ReportRoutes;
    // Get risk request Id and action Id from query/route param
    this.route.params.subscribe(params => {
      this.riskRequestId = +params[RiskConstantsService.RiskRequest.RiskRequestId];
    });
    this.baseService.showRootLoader = false;
  }

  //#region - Back to risk request dashboard
  backToRiskDashboard() {
    this.router.navigate([RiskConstantsService.RedirectUrls.MyRiskRequest]);
  }
  //#endregion

}
