import { Component, OnInit } from '@angular/core';
import { RiskDashboardFilter } from '../../model/riskDashboardFilter';
import { RiskDashboard } from '../../model/riskDashboard';
import { RiskService } from './../../services/risk.service';
import { RiskConstantsService } from './../../services/risk-constants.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-risk-dashboard',
  templateUrl: './risk-dashboard.component.html',
  styleUrls: ['./risk-dashboard.component.css']
})
export class RiskDashboardComponent implements OnInit {

  riskDashboardFilter: RiskDashboardFilter;
  riskData: RiskDashboard[];
  actionData = [];
  pendingAction = [];
  closedAction = [];
  noRecordsMsg: string;
  selectedPear = [];
  selectedRiskIdentified = [];
  isSelectedPearNull: boolean = true;
  isSelectedRiskIdentifiedNull: boolean = true;
  showPagination: boolean = true;
  loggedInUserJSON: any;
  riskStatus: string;
  pageSize: number;
  pearMaster = [];
  riskIdentified = [];
  totalRow = 10;
  rowCount: number;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];

  constructor(private baseService: BaseService,
    private riskService: RiskService) { }

  ngOnInit() {
    // Set routeURL and route name for Risk
    this.routesFlag = RiskConstantsService.RiskNavigation.Routes;
    this.reportRoutes = RiskConstantsService.RiskNavigation.ReportRoutes;
    this.pearMaster = RiskConstantsService.PearForDashboard;
    this.pearMaster.forEach((pear) => {
      pear.Checked = true;
    }
    );
    this.riskIdentified = RiskConstantsService.RiskIdentified;
    this.riskIdentified.forEach((riskIdentify) => {
      riskIdentify.Check = true;
    }
    );
    this.riskStatus = RiskConstantsService.Status.Pending;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.riskDashboardFilter = new RiskDashboardFilter();
    this.getRiskForDashboard();
  }

  getRiskForDashboard() {
    if (this.selectedPear.length === 0) {
      this.pearMaster.forEach((pear) => {
        this.selectedPear.push(pear.Id);
      }
      );
      this.isSelectedPearNull = false;
      this.riskDashboardFilter.StartRowIndex = 0;
      this.riskDashboardFilter.TotalRow = this.totalRow;
    }
    if (this.selectedRiskIdentified.length === 0) {
      this.riskIdentified.forEach(riskIdentify => {
        riskIdentify.Value.forEach(value => {
          this.selectedRiskIdentified.push(value);
        });
      });
      this.isSelectedRiskIdentifiedNull = false;
    }
    if (!this.rowCount) {
      this.rowCount = this.totalRow * 2;
    }
    this.riskDashboardFilter.EmployeeId = this.loggedInUserJSON.UserId;
    this.riskDashboardFilter.Status = this.riskStatus;
    this.riskDashboardFilter.RiskIdentified = this.selectedRiskIdentified;
    this.riskDashboardFilter.PotentialRiskPears = this.selectedPear;
    const apiRequest = {
      Model: this.riskDashboardFilter
    };
    this.riskService.getRiskForDashboard(apiRequest, this.callbackMethodForgetRiskForDashboard.bind(this));
  }

  callbackMethodForgetRiskForDashboard(response) {
    this.showPagination = true;
    this.riskData = response.Result;
    if (response.Result.length > 0) {
      this.riskData.forEach((risk) => {
        risk.RiskIdentified = this.riskService.getRiskColorClass(risk.PotentialRiskSeverity.toString(), risk.PotentialRiskLikelihood);
        risk.ResidualRisk = this.riskService.getRiskColorClass(risk.ResidualRiskSeverity.toString(), risk.ResidualRiskLikelihood);
      });
    }
    if (!response.Result || response.Result.length < this.totalRow) {
      this.rowCount = this.rowCount - this.totalRow;
    }
    if (response.Success) {
      if (response.Result.length === 0) {
        this.showPagination = false;
        this.noRecordsMsg = 'No records found!';
      }
    }
  }

  selectPear(checked, pear) {
    if (this.isSelectedPearNull === false) {
      this.selectedPear = [];
    }
    if (checked === true) {
      this.selectedPear.push(pear.Id);
      pear.Checked = true;
      this.isSelectedPearNull = true;
    } else {
      const index = this.selectedPear.indexOf(pear.Id);
      this.selectedPear.splice(index, 1);
      pear.Checked = false;
    }
  }

  selectRiskIdentified(checked, riskIdentified) {
    if (this.isSelectedRiskIdentifiedNull === false) {
      this.selectedRiskIdentified = [];
    }
    if (checked === true) {
      this.riskIdentified.forEach(riskIdentify => {
        if (riskIdentified.Id === riskIdentify.Id) {
          riskIdentify.Value.forEach(value => {
            this.selectedRiskIdentified.push(value);
          });
        }
        riskIdentify.Checked = true;
      });
      this.isSelectedRiskIdentifiedNull = true;
    } else {
      this.riskIdentified.forEach(riskIdentify => {
        if (riskIdentified.Id === riskIdentify.Id) {
          riskIdentify.Value.forEach(value => {
            const index = this.selectedRiskIdentified.indexOf(value);
            this.selectedRiskIdentified.splice(index, 1);
          });
        }
        riskIdentify.Checked = false;
      });
    }
  }

  descRiskAddedOn() {
    this.riskDashboardFilter.OrderdByColoumName = RiskConstantsService.OrderByColoumnName.CreatedDate;
    this.riskDashboardFilter.OrderdBy = RiskConstantsService.OrderBy.DESC;
    this.getRiskForDashboard();
  }

  ascRiskAddedOn() {
    this.riskDashboardFilter.OrderdByColoumName = RiskConstantsService.OrderByColoumnName.CreatedDate;
    this.riskDashboardFilter.OrderdBy = RiskConstantsService.OrderBy.ASC;
    this.getRiskForDashboard();
  }

  ascRiskRating() {
    this.riskDashboardFilter.OrderdByColoumName = RiskConstantsService.OrderByColoumnName.RiskRating;
    this.riskDashboardFilter.OrderdBy = RiskConstantsService.OrderBy.ASC;
    this.getRiskForDashboard();
  }

  descRiskRating() {
    this.riskDashboardFilter.OrderdByColoumName = RiskConstantsService.OrderByColoumnName.RiskRating;
    this.riskDashboardFilter.OrderdBy = RiskConstantsService.OrderBy.DESC;
    this.getRiskForDashboard();
  }

  doneFilter() {
    this.rowCount = this.totalRow * 2;
    this.getRiskForDashboard();
  }

  resetValue() {
    this.pearMaster.forEach((pear) => {
      pear.Checked = true;
    }
    );
    this.riskIdentified.forEach((riskIdentify) => {
      riskIdentify.Check = true;
    }
    );
    this.selectedPear = [];
    this.selectedRiskIdentified = [];
    this.rowCount = null;
    this.riskDashboardFilter.OrderdByColoumName = null;
    this.riskDashboardFilter.OrderdBy = null;
    this.getRiskForDashboard();
  }

  getServerData(event) {
    if (event === 1) {
      this.riskDashboardFilter.StartRowIndex = 0;
    } else {
      this.riskDashboardFilter.StartRowIndex = ((event * this.totalRow) - this.totalRow);
      this.rowCount = ((event + 1) * this.totalRow);
    }
    this.pageSize = event;
    this.getRiskForDashboard();
  }

  showAction(riskRequestId) {
    const apiRequest = {
      Model: {
        'RiskRequestId': riskRequestId
      }
    };
    // Get all observation type data
    this.riskService.getAllActionByRiskRequestId(apiRequest, this.callbackMethodForGetAllActionByRiskRequestId.bind(this));
  }

  callbackMethodForGetAllActionByRiskRequestId(response) {
    this.closedAction = [];
    this.pendingAction = [];
    this.actionData = response.Result;
    this.actionData.forEach(action => {
      if (action.Status.StatusName === RiskConstantsService.Status.Closed) {
        this.closedAction.push(action);
      } else {
        this.pendingAction.push(action);
      }
    });

  }
  tabChange(value) {
    if (value === RiskConstantsService.Status.Closed) {
      this.riskStatus = RiskConstantsService.Status.Closed;
    } else if (value === RiskConstantsService.Status.New) {
      this.riskStatus = RiskConstantsService.Status.New;
    } else if (value === RiskConstantsService.Status.Pending) {
      this.riskStatus = RiskConstantsService.Status.Pending;
    }
    this.resetValue();
  }
}
