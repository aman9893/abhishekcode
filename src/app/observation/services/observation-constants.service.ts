import { Injectable } from '@angular/core';

@Injectable()
export class ObservationConstantsService {

  constructor() { }

  // Module specific constants
  public static ObservationCardModuleConst = {
    observationFor: 'self',
    observationOnBehalfEmployee: 'onbehalfemp',
    ObservationOnBehalfContractor: 'onbehalfcontractor',
    SubmitDate: 'Submit Date',
    DESC: 'DESC',
    ASC: 'ASC',
    ObservationDate: 'Observation Date',
    Conversation: 'Conversation',
    Safe: 'Safe',
    ActBehaviour: 'Act/ Behaviour',
    Observation: 'Observation',
    Unsafe: 'Unsafe',
    ConditionConsequence: 'Condition/ Consequence',
    ObservationDashboard: 'HSE advisor dashboard',
    HealthHazard: 'Health Hazard',
    ExplodingBomb: 'ExplodingBomb',
    Flame: 'Flame',
    ExclamationMark: 'Exclamation Mark',
    GasCylinder: 'Gas Cylinder',
    Oxidizer: 'Oxidizer',
    HSEAdvisor: 'HSEAdvisor',
    LoggedInUser: 'loggedInUser',
    Other: 'Other',
    TakeAction: 'Take Action',
    Reports: 'Reports',
    ViewClosureDetails: 'View Closure Details',
    NA: 'NA',
    OBS: 'OBS' ,
    };

  // Company Constants
  public static CompanyConst = {
    QAMP: 'QAMP'
  };

  // Status Constants
  public static Status = {
    New: 'New',
    Closed: 'Closed',
    Deleted: 'Deleted',
    Assigned: 'Assigned',
    Acknowledged: 'Acknowledged',
    ActionsAdded: 'ActionsAdded',
    Cancelled: 'Cancelled',
  };

  // URL constant
  public static ObservationCardURL = {
    InsertObservationData: 'api/hse/observationCard/insertObservationData',
    GetLocationDetails: 'api/hse/observationCard/getLocationDetails',
    GetCompanyDetails: 'api/hse/observationCard/getCompanyDetails',
    GetObservationData: 'api/hse/observationCard/getObservationcardData',
    GetProcess: 'api/common/master/getProcess',
    GetStatusByProcessId: 'api/common/get/statusByProcessId',
    GetUserTypes: 'api/common/get/userTypes',
    GetUsersOnSearch: 'api/common/get/usersOnSearch',
    GetUserDetails: 'api/hse/observationCard/getUserDetailsByUserId',
    GetObservationRequest: 'api/hse/observationCard/GetObservationRequest',
    CancelObservationRequest: 'api/hse/observationCard/cancelobservationrequest',
    CloseObservationRequest: 'api/hse/observationCard/CloseObservationRequest',
    UpdateObservationData: 'api/hse/observationCard/updateObservationData',
    InsertActonDetails: 'api/hse/actionTracker/insertActionData',
    GetObservationRequestForHSEAdvisor: 'api/hse/observationCard/GetObservationRequestForHSEAdvisor',
    GetObservationForHSEAdvisor: 'api/hse/observationCard/GetObservationRequestForDelete',
    DeleteObservationByHSEAdvisor: 'api/hse/observationCard/DeleteObservationByHSEAdvisor',
    GetObservationTypeByCompanyId: 'api/hse/observationCard/getobservationtypebycompanyid',
    GetHazardTypeByCompanyId: 'api/hse/configuration/gethazarddetails',
    GetObservationRequestsForDashboard: 'api/hse/observationCard/getpastobservationrequestsfordashboard',
    AcknowledgeObservationRequest: 'api/hse/observationCard/acknowledgeobservationrequest',
    GetObservationRequestByObservationId: 'api/hse/observationCard/getobservationrequestbyobservationid',
    GetActionsByObservationId: 'api/hse/actionTracker/GetActionDetailsByObservationId',
    GetTempObservationRequestForBackOffice: 'api/hse/observationCard/gettempobservationrequestforbackoffice',
    GetUserDetailsByTempObservationId: 'api/hse/observationCard/getuserdetailsbytempobservationid',
    DeleteObservationRequestByTempObsId: 'api/hse/observationCard/deleteobservationrequestbytempObsId',
    UpdateTempObservationRequestForBackOffice: 'api/hse/observationCard/updatetempobservationrequestforbackoffice',
    GetObservationStatusReport: 'api/report/get/observationStatusReport',
    GetAllActionByObservationId: 'api/hse/actionTracker/GetAllActionByObservationId',
    ExportToExcel: 'api/hse/observation/ExportToExcel',
    UpdateHazardType: 'api/hse/observationCard/updateHazardType'
  };

  // Routing URL
  public static RoutingURLConstant = {
    MyObservationURL: '/observation/past-observations-dashboard',
    ObservationDashboardURL: '/observation/observation-card-dashboard',
    ObservationCardURL: '/observation/raise-observation/new'
  };

  // Side bar routesURL and routeName of Observation
  public static ObservationNavigation = {
    Routes: [
      {
        routeName: 'Home',
        routeURL: '../../home'
      },
      {
        routeName: 'Observation card',
        routeURL: '/observation/raise-observation/new'
      },
      {
        routeName: 'My observations',
        routeURL: '/observation/past-observations-dashboard'
      },
      {
        routeName: 'HSE advisor dashboard',
        routeURL: '/observation/observation-card-dashboard'
      },
      {
        routeName: 'Back-office Dashboard',
        routeURL: '/observation/back-office-dashboard'
      }
    ],
     InnerRoutes: [
      {
        routeName: 'Home',
        routeURL: '../../../home'
      },
      {
        routeName: 'Observation card',
        routeURL: '/observation/raise-observation/new'
      },
      {
        routeName: 'My observations',
        routeURL: '/observation/past-observations-dashboard'
      },
      {
        routeName: 'HSE advisor dashboard',
        routeURL: '/observation/observation-card-dashboard'
      },
      {
        routeName: 'Back-office Dashboard',
        routeURL: '/observation/back-office-dashboard'
      }
    ],
    ReportRoutes: [
      {
        routeName: 'observation-category-trend-report',
        routeURL: '/report/observation-category-trend-report'
      },
      {
        routeName: 'observation-requests-trend-report',
        routeURL: '/report/observation-requests-trend-report'
      },
      {
        routeName: 'observation-type-trend-report',
        routeURL: '/report/observation-type-trend-report'
      },
      {
        routeName: 'action-trend-report',
        routeURL: '/report/action-trend-report'
      },
      {
        routeName: 'observation-status-report',
        routeURL: '/report/observation-status-report'
      }
    ]
  };
  // Chcek Observation type message
  public static ObservationType = {
    didYouSee: 'didYouSee',
    didYouDo: 'didYouDo',
    improvedType: 'improvedType'
  };

  // Event on Click
  public static EventType = {
    mouseenter: 'mouseenter',
  };

  // Observation Status
  public static ObservationStatus = {
    New: 'New',
    Acknowledged: 'Acknowledged',
    Cancelled: 'Cancelled',
    Closed: 'Closed',
    Deleted: 'Deleted',
    Pending: 'Pending',
    Submitted: 'Submitted'
  };

  // request for
  public static RequestFor = {
    Self: 'Self',
    OnBehalf: 'On Behalf',
    Contractor: 'Contractor'
  };

  // Success, confiramtion and exceptional message
  public static Message = {
    ObservationCancelledSuccess: 'Observation Cancelled successfully',
    ObservationCancelledConfirmation: 'Are you sure want to cancel this observation Card?',
    BackOfficeRequestDeleted: 'Request deleted successfully',
    BackOfficeConfirmationMessage: 'Do you really want to delete this request?'
  };

  // Comment section constants, used for action comment configuration
  public static AcitonCommentConstants = {
    HSEAdviserToActionOwner: 'HSE Adviser added action and assigned it to Action owner :',
    HSEAdviserToActionParty: 'HSE Adviser added action and assigned it to Action Party :',
    HSEAdviserToActionVerifier: 'HSE Adviser added action and assigned it to Action Verifier :',
    HSEAdviserCloseAction: 'HSE Adviser has closed action.',
    HSEAdviserChangeActionOwner: 'HSE Adviser has changed the Action owner to :',
    HSEAdviserChangeActionParty: 'HSE Adviser has changed the Action party to :',
    HSEAdviserChangeActionVerifier: 'HSE Adviser has changed the Action verifier to :',
    ActionOwner: 'Action owner has updated the action details. Action owner :',
    ActionParty: 'Action party has updated the action details. Action party :',
    ActionVerifier: 'Action verifier has updated the action details. Action verifier :',
    StatusFrom: 'Action status changed from :',
    StatusTo: 'Action status changed to :',
    ActionDeleted: 'Action deleted successfully'
  };

  public static Tooltip = {
    TakeAction : 'Take Action',
    ViewDetails : 'View Details',
    ViewAction: 'View Observation'

  };

  public static StatusList = {
    StatusId: 1000,
    StatusName: 'Assigned',
    checked: false
  };

  // Set Back office URL
  public static SubRouting = {
    Backofficedashboard: 'back-office-dashboard'
  };

  // Back office drop down delete constant
  public static ReasonForDeletion = [
    { label: 'Blur image', value: 'Blur image' },
    { label: 'Irrelevant image', value: 'Irrelevant image' }
  ];
  public static ToolTip = {
    TakeAction: 'Take Action',
    ViewAction: 'View Observation',
  };
   public static MultiSelectStatus = [
            {label: 'Submitted', value: 'Submitted'}
        ];
}
