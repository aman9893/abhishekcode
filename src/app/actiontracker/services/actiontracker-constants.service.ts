import { Injectable } from '@angular/core';

@Injectable()
export class ActiontrackerConstantsService {

  constructor() { }

  // Routing URL
  public static RoutingURLConstant = {
    ActionTrackerDashboardURL: '/actiontracker/action-party-dashboard',
    ActionOwnerDashboardURL: '/actiontracker/action-owner-dashboard',
    ActionVerifierDashboardURL: '/actiontracker/verifier-dashboard',
    ActionPartyDashboardURL: '/actiontracker/action-party-dashboard'
  };

  public static ActiontrackerNavigation = {
    Routes: [
      {
        routeName: 'Home',
        routeURL: '../../home'
      },
      {
        routeName: 'Verifier dashboard',
        routeURL: '/actiontracker/verifier-dashboard'
      },
      {
        routeName: 'Action Owner dashboard',
        routeURL: '/actiontracker/action-owner-dashboard'
      },
      // {
      //   routeName: 'Action Party dashboard',
      //   routeURL: '/actiontracker/action-party-dashboard'
      // },
      {
        routeName: 'Action Party dashboard',
        routeURL: '/actiontracker/action-party-dashboard'
      }
    ],
    InnerRoutes: [
      {
        routeName: 'Home',
        routeURL: '../../../home'
      },
      {
        routeName: 'Verifier dashboard',
        routeURL: '/actiontracker/verifier-dashboard'
      },
      {
        routeName: 'Action Owner dashboard',
        routeURL: '/actiontracker/action-owner-dashboard'
      },
      // {
      //   routeName: 'Action Party dashboard',
      //   routeURL: '/actiontracker/action-party-dashboard'
      // },
      {
        routeName: 'Action Party dashboard',
        routeURL: '/actiontracker/action-party-dashboard'
      }
    ],
    ReportRoutes: [
      {
        routeName: 'action-trend-report',
        routeURL: '/report/action-trend-report'
      }
    ]
  };

  // Module specific constants
  public static ActiontrackerModuleConst = {
    observationFor: 'self',
    observationOnBehalfEmployee: 'onbehalfemp',
    ObservationOnBehalfContractor: 'onbehalfcontractor',
    DESC: 'DESC',
    ASC: 'ASC',
    CreatedDate: 'Created Date',
    TargetDate: 'Target Date',
    Safe: 'Safe',
    ActBehaviour: 'Act/ Behaviour',
    Observation: 'Observation',
    Unsafe: 'Unsafe',
    ConditionConsequence: 'Condition/ Consequence',
    ObservationDashboard: 'Observation Dashboard',
    HealthHazard: 'Health Hazard',
    ExplodingBomb: 'ExplodingBomb',
    Flame: 'Flame',
    ExclamationMark: 'Exclamation Mark',
    GasCylinder: 'Gas Cylinder',
    Oxidizer: 'Oxidizer',
    HSEAdvisor: 'HSEAdvisor',
    Incident: 'Incident',
    Meeting: 'Meeting',
    Risk: 'Risk',
    Done: 'Done',
    Action: 'Action',
    loggedInUser: 'loggedInUser',
    actionId: 'actionId',
    Employee: 'Employee'
  };

  // constatnt for status
  public static Status = {
    New: 'New',
    Open: 'Open',
    Pending: 'Pending',
    Assigned: 'Assigned',
    Closed: 'Closed',
    Closure: 'Closure',
    Accepted: 'Accepted',
    Rejected: 'Rejected',
    Done: 'Done',
    Verified: 'Verified',
    Completed: 'Completed',
    Reassigned: 'Reassigned',
    Reopen: 'Reopen'
  };

  // URL constant
  public static ActiontrackerURL = {
    SubmitActionDetails: 'api/hse/actionTracker/insertActionData',
    GetActionsByFilters: 'api/hse/actionTracker/getActionsByFilters',
    GetStatusByProcessId: 'api/common/get/statusByProcessId',
    GetUploadedDocumentById: 'api/common/get/uploadedDocumentById',
    GetProcess: 'api/common/master/getProcess',
    GetActionDetailsById: 'api/hse/actionTracker/getActionDetailsById',
    GetActionAssignmentHistoryDetails: 'api/hse/actionTracker/GetActionAssignmentHistoryDetails',
    GetObservationRequest: 'api/hse/observationCard/getObservationRequest',
    GetActionForVerifierDashboard: 'api/hse/actionTracker/GetActionForActionVerifierDashboard',
    GetActionForActionOwnerDashboard: 'api/hse/actionTracker/GetActionForActionOwnerDashboard',
    GetObservationTypeByCompanyId: 'api/hse/observationCard/getobservationtypebycompanyid',
    GetObservationDetailForActionOwner: 'api/hse/observationCard/GetObservationDetailForActionOwner',
    ActionAssignByActionOwner: 'api/hse/actionTracker/AssignActionByActionOwner',
    GetActionGetModelById: 'api/hse/actionTracker/GetActionGetModelById',
    SubmitVerifierAction: 'api/hse/actionTracker/SubmitVerifierAction',
    GetActionForActionPartyDashboard: 'api/hse/actionTracker/GetActionForActionPartyDashboard',
    ReassignActionToActionParty: 'api/hse/actionTracker/ReassignActionToActionParty',
    CloseAction: 'api/hse/actionTracker/CloseAction',
    GetActionDetailsForRiskRequestByActionId: 'api/hse/actionTracker/GetActionDetailsForRiskRequestByActionId'
  };
  // priority
  public static Priority = {
    Priority: [
      {
        Id: 1,
        Priority: 'High',
        checked: false
      },
      {
        Id: 2,
        Priority: 'Medium',
        checked: false
      },
      {
        Id: 3,
        Priority: 'Low',
        checked: false
      }
    ]
  };

  public static Message = {
    CloseSuccessMessage: 'Action has been closed',
    ReassignMessage: 'Action has been reassigned to  ',
  };

  public static StatusList = {
    StatusId: 2000,
    StatusName: 'Reassigned',
    checked: false
  };
  public static ToolTip = {
    ExecuteAction: 'Execute Action',
    DoneAction: 'View Details',
    VerifyAction: 'Verify Action',
    AssignAction: 'Assign Action'
  };

  public static DueDate = {
OverDueAction: 'overdue-actions',
ApprochingAction: 'approaching-due-dt'
  };
}
