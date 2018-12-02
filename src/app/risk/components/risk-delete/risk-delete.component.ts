import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RiskConstantsService } from './../../services/risk-constants.service';
import { BaseService } from './../../../shared/services/base.service';
import { RiskService } from './../../services/risk.service';
import { ConstantsService } from '../../../shared/services/constants.service';

@Component({
  selector: 'app-risk-delete',
  templateUrl: './risk-delete.component.html',
  styleUrls: ['./risk-delete.component.css']
})
export class RiskDeleteComponent implements OnInit {

  deletionReason: string;
  riskRequestId: number;
  alertType: string;
  confirmMessage: string;
  successDetails: string;
  isDeletionreason: boolean = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private baseService: BaseService,
    private riskService: RiskService) { }

  ngOnInit() {
    if (!this.riskRequestId) {
      this.route.params.subscribe(params => {
        this.riskRequestId = +params['riskId'];
      });
    }
  }

  deleteRiskRequest() {
    if (!this.deletionReason) {
      this.isDeletionreason = true;
    } else {
      this.alertType = ConstantsService.Confirm;
      this.confirmMessage = 'Sure you want to delete it?';
    }
  }
  callbackMethodForDeleteRisk(response) {
    if (response.Success === true) {
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Risk has been Deleted';
    }
  }
  onYesClickedForConfirmation() {
    const apiRequest = {
      Model: {
        RiskRequestId: this.riskRequestId,
        DeletionReason: this.deletionReason,
      }
    };
    this.riskService.deleteRiskRequest(apiRequest, this.callbackMethodForDeleteRisk.bind(this));
  }

  onNoClickedForConfirmation() {
    this.alertType = '';
    this.confirmMessage = '';
  }
  onYesClickedSuccess() {
    this.router.navigate([RiskConstantsService.RedirectUrls.MyRiskRequest]);
  }
}
