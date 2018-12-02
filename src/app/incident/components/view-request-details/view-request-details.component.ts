import { Component, OnInit, Input } from '@angular/core';

import { IncidentRequestGet } from './../../model/incidentRequestPost.model';

import { BaseService } from './../../../shared/services/base.service';
import { IncidentService } from './../../services/incident.service';
import { IncidentConstantsService } from './../../services/incident-constants-service';
import { User } from '../../../shared/models/user.model';
import { PeopleInvolved } from '../../model/peopleInvolved.model';
import { IncidentCategory } from '../../model/incidentCategory.model';
import { IncidentType } from '../../model/incidentType.model';
import { SpilDetails } from '../../model/spilDetails.model';
import { Company } from '../../../observation/model/company.model';
import { LocationDetails } from '../../../masterscreen/model/admin-master.model';

@Component({
  selector: 'app-view-request-details',
  templateUrl: './view-request-details.component.html',
  styleUrls: ['./view-request-details.component.css']
})
export class ViewRequestDetailsComponent implements OnInit {
  @Input() incidentRequestId;
  incidentRequestData: IncidentRequestGet;
  incident: string;
  dateFormatDDMMYYYYHHMMSS = '';
  CommunicationSourceList: any;
  CommunicationSourceName: string;

  constructor(private baseService: BaseService,
    private incidentService: IncidentService) { }

  ngOnInit() {
    this.incidentRequestData = new IncidentRequestGet();
    this.incidentRequestData.RaisedBy = new User();
    this.incidentRequestData.Location = new LocationDetails();
    this.incidentRequestData.NotificationBy = new User();
    this.incidentRequestData.CaseOwner = new User();
    this.incidentRequestData.Company = new Company();
    this.dateFormatDDMMYYYYHHMMSS = this.baseService.dateFormatDDMMYYYYHHMMSS;
    this.CommunicationSourceList = IncidentConstantsService.CommunicationSource.CommunicationSource;
    // Get Incident Request by incident request id
    this.getIncidentRequestByIncidentRequestId();
  }

  //#region - Get incident request by incident id
  getIncidentRequestByIncidentRequestId() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        IncidentRequestId: this.incidentRequestId
      }
    };

    this.incidentService.getIncidentRequestByIncidentRequestId(apiRequest, this.callBackMethodForGetIncidentRequest.bind(this));
  }

  callBackMethodForGetIncidentRequest(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Result && response.Success) {
      this.incidentRequestData = response.Result;
      // Convert into coummunication source name
      this.CommunicationSourceList.filter((item) => {
        if (item.Id === this.incidentRequestData.CommunicationSource) {
          this.CommunicationSourceName = item.Value;
        }
      });
      // Get incident details based on severity and Pear
      this.incident = this.incidentService.getIncidentColorClass(this.incidentRequestData.Severity,
        this.incidentRequestData.Pear);
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion
}
