import { Injectable } from '@angular/core';

@Injectable()
export class RiskConstantsService {

  constructor() { }

  public static ApiConstants = {
    GetAllMasterForRiskRaise: 'api/risk/get/allMasterForRiskRaise',
    RaiseRisk: 'api/risk/raise/riskRequest',
    GetRiskForDashboard: 'api/risk/get/riskForDashboard',
    GetAllActionByRiskRequestId: 'api/risk/get/actionDataByRiskRequestId',
    GetRiskRequestByRiskId: 'api/risk/get/riskRequestByRiskRequestId',
    GetRiskRequestPostEntityById: 'api/risk/get/getRiskRequestPostEntityById',
    UpdateActionDetailsByActionOwnerForRisk: 'api/hse/actionTracker/updateActionDetailsByActionOwnerForRisk',
    GetRiskRequestForEdit: 'api/risk/get/getRiskRequestForEdit',
    UpdateRisk: 'api/risk/update/RiskRequest',
    DeleteRisk: 'api/risk/delete/RiskRequest',
    GetCompletedActionByRiskId: 'api/risk/get/completedActionByRiskId',
    CloseRiskRequestByRiskId: 'api/risk/close/riskRequestByRiskId',
    GetActionPartyByActionId: 'api/risk/get/getActionPartyByActionId'
  };

  public static Pear = ['People', 'Assets', 'Environment', 'Reputation'];
  public static Consequence = ['A', 'B', 'C', 'D', 'E'];
  public static Severity = ['1', '2', '3', '4', '5'];

  public static RiskType = {
    Potential: 'Potential',
    Residual: 'Residual'
  };

  public static Status = {
    New: 'New',
    Closed: 'Closed',
    Pending: 'Pending'
  };

  public static RedirectUrls = {
    MyRiskRequest: '/risk/risk-dashboard'
  };

  public static OrderByColoumnName = {
    CreatedDate: 'Created Date',
    RiskRating: 'Risk Rating'
  };

  public static OrderBy = {
    ASC: 'ASC',
    DESC: 'DESC'
  };
  public static RiskIdentified = [
    {
      Id: 'Intolerable (Red)',
      Colour: 'intolerable',
      Value: ['3E', '4D', '4E', '5C', '5D', '5E'],
      Check: false
    },
    {
      Id: 'Tolerable (Yellow)',
      Colour: 'tolerable-yellow',
      Value: ['1C', '1D', '1E', '2B', '2C', '3A', '3B', '4A'],
      Check: false
    },
    {
      Id: 'Tolerable (Orange)',
      Colour: 'tolerable-orange',
      Value: ['2D', '2E', '3C', '3D', '4B', '4C', '5A', '5B'],
      Check: false
    },
    {
      Id: 'Acceptable (Green)',
      Colour: 'acceptable',
      Value: ['1A', '1B', '2A'],
      Check: false
    }
  ];

  public static PearForDashboard =
    [{
      Id: 'People',
      Checked: false
    },
    {
      Id: 'Reputation',
      Checked: false
    },
    {
      Id: 'Assets',
      Checked: false
    },
    {
      Id: 'Environment',
      Checked: false
    }];

  public static RiskRequest = {
    RiskRequestId: 'riskRequestId'
  };

  public static RoutingURLConstant = {
    ActionOwnerDashboardURL: '/actiontracker/action-owner-dashboard'
  };

  public static Alert = {
    ConfirmationMessage: 'You are going back to dashboard. Information entered by you will not be saved. Do you want to continue? '
  };

  // Side bar routesURL and routeName of Risk
  public static RiskNavigation = {
    Routes: [
      {
        routeName: 'Home',
        routeURL: '../../home'
      },
      {
        routeName: 'Raise risk',
        routeURL: '/risk/raise-risk/0'
      },
      {
        routeName: 'Risk dashboard',
        routeURL: '/risk/risk-dashboard'
      }
    ],
    InnerRoutes: [
      {
        routeName: 'Home',
        routeURL: '../../../home'
      },
      {
        routeName: 'Raise risk',
        routeURL: '/risk/raise-risk/0'
      },
      {
        routeName: 'Risk dashboard',
        routeURL: '/risk/risk-dashboard'
      }
    ],
    ReportRoutes: [
    ]
  };
}
