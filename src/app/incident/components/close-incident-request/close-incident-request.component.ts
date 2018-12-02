import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseService } from './../../../shared/services/base.service';
import { IncidentConstantsService } from './../../services/incident-constants-service';
import { IncidentService } from './../../services/incident.service';
import { ConstantsService } from './../../../shared/services/constants.service';

@Component({
  selector: 'app-close-incident-request',
  templateUrl: './close-incident-request.component.html',
  styleUrls: ['./close-incident-request.component.css']
})
export class CloseIncidentRequestComponent implements OnInit {
  incidentRequestId: number;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
  closureDetails: string;
  successDetails: string;
  alertType: string;
  validationOnReason: boolean = false;

  constructor(private baseService: BaseService,
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private router: Router) { }

  ngOnInit() {
    // Set routeURL and route name
    this.routesFlag = IncidentConstantsService.IncidentNavigation.InnerRoutes;
    this.reportRoutes = IncidentConstantsService.IncidentNavigation.ReportRoutes;
    if (!this.incidentRequestId) {
      this.route.params.subscribe(params => {
        this.incidentRequestId = +params['incidentRequestId'];
      });
      this.baseService.showRootLoader = false;
    }
  }

  //#region- Close Incident Request by incident request id
  closeIncidentRequest() {
    if (this.closureDetails) {
      this.baseService.showRootLoader = true;
      const apiRequest = {
        Model: {
          IncidentRequestId: this.incidentRequestId,
          ClosureRemarks: this.closureDetails
        }
      };
      this.incidentService.closeRequestByIncidentRequestId(apiRequest, this.callbackToCloseIncidentRequestById.bind(this));
    } else {
      this.validationOnReason = true;
    }
  }

  callbackToCloseIncidentRequestById(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Incident request closed successfully';
    } else {
      this.baseService.processApiResponseError(response);
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
    this.router.navigate([IncidentConstantsService.RoutingURLConstant.CaseOwnerDashboardURL]);
  }
  //#endregion
}
