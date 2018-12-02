import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseService } from './../../../shared/services/base.service';
import { IncidentConstantsService } from './../../services/incident-constants-service';
import { IncidentService } from './../../services/incident.service';
import { ConstantsService } from './../../../shared/services/constants.service';

@Component({
  selector: 'app-view-incident',
  templateUrl: './view-incident.component.html',
  styleUrls: ['./view-incident.component.css']
})
export class ViewIncidentComponent implements OnInit {
incidentRequestId: number;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];
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

}
