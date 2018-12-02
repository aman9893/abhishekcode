import { Injectable } from '@angular/core';

@Injectable()
export class IncidentConstantsService {

  constructor() { }
  // URL constant
  public static IncidentURL = {
    GetIncidentTypeByCompanyId: 'api/incident/configuration/getIncidentTypeDetails',
    GetIncidentCategoryByCompanyId: 'api/incident/configuration/getIncidentCategoryDetails',
    RaiseIncident: 'api/incident/raise/incidentRequest',
    GetIncidentRequestByUserId: 'api/incident/get/incidentRequestByUserId',
    GetIncidentDataByIncidentId: 'api/incident/get/incidentByIncidentRequestId',
    UpdateIncidentData: 'api/incident/update/incidentRequest',
    GetIncidentRequestByIncidentRequestId: 'api/incident/get/incidentRequestByIncidentRequestId',
    CloseRequestByIncidentRequestId: 'api/incident/close/incidentByIncidentRequestId'
  };
  // Module specific constants
  public static CommunicationSource = {
    CommunicationSource: [
      {
        Id: 1,
        Value: 'Email',
      },
      {
        Id: 2,
        Value: 'Phone',
      },
      {
        Id: 3,
        Value: 'Fax'
      }
    ]
  };

  public static Job = {
    Job: [
      {
        Id: 1,
        Value: 'aa',
      },
      {
        Id: 2,
        Value: 'ac',
      },
      {
        Id: 3,
        Value: 'ab'
      }
    ]
  };

  // Incident Status
  public static IncidentStatus = {
    New: 'New',
    Closed: 'Closed'
  };

  // Dashboard Filter
  public static DasboardFilter = {
    SubmitDate: 'Submit Date',
    DESC: 'DESC',
    ASC: 'ASC'
  };

  public static RoutingURLConstant = {
    RaiseIncidentURL: '/incident/raise-incident/0',
    IncidentDashBoardURL: '/incident/incident-dashboard',
    CaseOwnerDashboardURL: '/incident/incident-case-owner-dashboard'
  };
  // Side bar routesURL and routeName of Incident
  public static IncidentNavigation = {
    Routes: [
      {
        routeName: 'Home',
        routeURL: '../../home'
      },
      {
        routeName: 'Raise incident',
        routeURL: '/incident/raise-incident/0'
      },
      {
        routeName: 'Incident dashboard',
        routeURL: '/incident/incident-dashboard'
      },
      {
        routeName: 'Case Owner dashboard',
        routeURL: '/incident/incident-case-owner-dashboard'
      }
    ],
    InnerRoutes: [
      {
        routeName: 'Home',
        routeURL: '../../../home'
      },
      {
        routeName: 'Raise incident',
        routeURL: '/incident/raise-incident/0'
      },
      {
        routeName: 'Incident dashboard',
        routeURL: '/incident/incident-dashboard'
      },
      {
        routeName: 'Case Owner dashboard',
        routeURL: '/incident/incident-case-owner-dashboard'
      }
    ],

    ReportRoutes: [
    ]
  };
}
