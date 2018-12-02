import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RiskConstantsService } from './../../services/risk-constants.service';
import { BaseService } from './../../../shared/services/base.service';
import { RiskRequestGet } from './../../../risk/model/riskRequest.model';
import { RiskService } from './../../services/risk.service';
import { Project, RiskManagementTool, RiskSource, RiskControlTechniques } from '../../../risk/model/raiseRiskAllMaster';
import { LocationDetails } from '../../../masterscreen/model/admin-master.model';

@Component({
  selector: 'app-view-risk',
  templateUrl: './view-risk.component.html',
  styleUrls: ['./view-risk.component.css']
})
export class ViewRiskComponent implements OnInit {
  @Input() riskRequestId: number;
  riskRequestDetails: RiskRequestGet;
  potentialRiskColor = '';
  residualRiskColor = '';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private baseService: BaseService,
    private riskService: RiskService) {
    this.riskRequestDetails = new RiskRequestGet();
    this.riskRequestDetails.LocationDetails = new LocationDetails();
    this.riskRequestDetails.ProjectDetails = new Project();
    this.riskRequestDetails.RiskManagmentTool = new RiskManagementTool();
    this.riskRequestDetails.RiskSource = new RiskSource();
    this.riskRequestDetails.RiskControlTechniques = new RiskControlTechniques();
  }

  ngOnInit() {
    // If user will riskrequestid from query param
    if (!this.riskRequestId) {
      this.route.params.subscribe(params => {
        this.riskRequestId = +params['riskId'];
      });
    }
    // Get Risk Request based on Action Id
    this.getRiskRequestByRiskRequestId();
  }
  //#region - Get Risk Requests by Risk id
  getRiskRequestByRiskRequestId() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        RiskRequestId: this.riskRequestId
      }
    };
    this.riskService.getRiskRequestByRiskRequestId(apiRequest,
      this.callbackRiskRequestByRiskRequestId.bind(this));
  }

  callbackRiskRequestByRiskRequestId(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Result && response.Success) {
      this.riskRequestDetails = response.Result;
      this.potentialRiskColor = this.riskService.getRiskColorClass((this.riskRequestDetails.PotentialRiskSeverity).toString(),
        this.riskRequestDetails.PotentialRiskLikelihood);
      this.residualRiskColor = this.riskService.getRiskColorClass((this.riskRequestDetails.ResidualRiskSeverity).toString(),
        this.riskRequestDetails.ResidualRiskLikelihood);
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
}
