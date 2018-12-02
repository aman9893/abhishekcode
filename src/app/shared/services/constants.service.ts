import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  constructor() { }

  public static URL = {
    // Local Environment
    APP: 'http://localhost:4200/',
    API: 'https://localhost:44388/',

    // QA
    // APP: 'https://arahsewebapp.azurewebsites.net/',
    // API: 'https://arahsewebapi.azurewebsites.net/',

    // UAT
    // APP: 'https://arahseuatapp.azurewebsites.net/',
    // API: 'https://arahseuatapi.azurewebsites.net/',

    HOMEPAGE: 'home',
    MasterScreen: 'masterscreen'
  };

  public static ADALCONFIG = {
    ANONYMOUS_ENDPOINTS: [
      'api/authentication/getdomaindetails',
      'api/authentication/authenticatecontractorlogin',
      'api/common/send/forgetpassword'
    ]
  };

  public static APIURL = {
    Authentication: {
      Ping: 'api/authentication/ping',
      GetDomainDetails: 'api/authentication/getdomaindetails',
      AuthenticateContractor: 'api/authentication/authenticatecontractorlogin'
    },
    Common: {
      ForgetPassword: 'api/common/send/forgetpassword',
      GetUserByEmailOrId: 'api/common/get/userbyemailorid',
      GetStatusListByProcessName: 'api/common/get/statuslistbyprocessname',
      ChangePassword: 'api/common/configuration/changeUserPassword',
      GetUsersOnSearch: 'api/common/get/usersOnSearch'
    }
  };

  // Add common constants
  public static commonConstants = {
    opensideBar: 'opensidebar',
    loggedInUser: 'loggedInUser',
    opensubmenu: 'opensubmenu'
  };

  public static authenticationType = {
    Contractor: 'Contractor',
    Employee: 'Employee'
  };

  // Alert Types
  public static Success = 'Success';
  public static Error = 'Error';
  public static Warning = 'Warning';
  public static Confirm = 'Confirm';

  // Role details
  public static Roles = {
    AppAdminRole: 'AppAdmin',
    HSEAdvisor: 'HSEAdvisor',
    HSEMember: 'HSEMember'
  };

  public static ContractorLoginResponse = 'ContractorLoginResponse';
  public static LoggedInUserType = 'LoggedInUserType';

  // Declartion of company name
  public static CompanyName = {
    B44: 'B44',
    QAMP: 'QAMP'
  };

  // Set Process Name
  public static ProcessName = {
    Observation: 'Observation',
    TempObservation: 'TempObservation',
    Incident: 'Incident'
  };

  // Set Active / InActive for fields
  public static ActiveInactiveStatus = {
    Active: 'Active',
    Inactive: 'Inactive'
  };

  // Collection Of Role
  public static UserRole = {
    HSEAdvisor: 'HSEAdvisor'
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
    StatusTo: 'Action status changed to :'
  };

  // Set List of Status
  public static Status = {
    Deleted: 'Deleted',
    Acknowledged: 'Acknowledged',
    Cancelled: 'Cancelled',
    Closed: 'Closed'
  };

  // Set Module Name
  public static Module = {
    Observation: 'observation'
  };
}
