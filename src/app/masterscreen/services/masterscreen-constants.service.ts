import { Injectable } from '@angular/core';

@Injectable()
export class MasterscreenConstantsService {

  constructor() { }

    // Serach type for User
    public static UserType = {
      Employee: 'Employee'
    };

  // Constants Message for success and error
  public static Message = {
    SuccessObservation: 'Observation Details submitted successfully',
    UpdateObservation: 'Observation Details updated successfully',
    DeleteConfrmationObservation: 'Are you sure you want to delete this Observation Type? Yes / No',
    DeleteObservation: 'Observation Type deleted successfully',
    SelectConfirmationForActive: 'If you make Observation Type inactive,' + ' ' +
      'then it will not appear in any forms for selection. Do you want to continue ?',
    SuccessHazardDetails: 'Hazard Details submitted successfully',
    UpdateHazardDetials: 'Hazard Details updated successfully',
    UpdateObservationCategory: 'Observation Category updated successfully',
    SuccessObservationCategory: 'Observation Category submitted successfully',
    DeleteConfrmationObservationCategory: 'Are you sure you want to delete this Observation Category? Yes / No',
    DeleteObservationCategory: 'Observation Category deleted successfully',
    SubmitConfigurationSuccessfully: 'Configuration details submitted successfully',
    DeleteUserRoleMapping: '{0} is removed from the {1}',
    DeleteConfirmationRoleMapping: 'Do you want to remove an employee from {0} Role?  (Y / N)',
    RaiseCountExceededForHseAdviser: 'Sorry! cannot delete the role because {0} has {1} request pending with him/her.' +
      '{2} can be removed only after his / her pending tasks are completed',
    SucceessRoleMapping: 'User role mapping completed',
    SelectConfirmationForActiveObsCat: 'If you make Observation Category inactive,' + ' ' +
      'then it will not appear in any forms for selection. Do you want to continue ?'
  };

  // API URl for configuration screen
  public static APIURL = {
    getCompanyDetails: 'api/hse/configuration/getcompanydetails',
    getProjectDetails: 'api/hse/configuration/getprojectdetails',
    getLocationDetails: 'api/hse/configuration/getlocationdetails',
    saveCompanyDetails: 'api/hse/configuration/savecompanydetails',
    saveProjectDetails: 'api/hse/configuration/saveprojectdetails',
    saveLocationDetails: 'api/hse/configuration/savelocationdetails',
    saveConfigurationDetails: 'api/common/configuration/saveConfigurationDetails',
    saveContractorDetails: 'api/common/configuration/saveuserdetails',
    getContractorDetails: 'api/common/configuration/getuserdetails',
    getAllContractors: 'api/common/configuration/getallcontractors',
    deleteContractorDetails: 'api/common/configuration/deleteuserdetails',
    saveHazardDetails: 'api/hse/configuration/savehazarddetails',
    getHazardDetails: 'api/hse/configuration/gethazarddetails',
    deleteHazardDetails: 'api/hse/configuration/deletehazarddetails',
    saveObservationTypeDetails: 'api/hse/configuration/saveobservationtypedetails',
    deleteObservationTypeDetails: 'api/hse/configuration/deleteobservationtypedetails',
    getObservationTypeDetails: 'api/hse/configuration/getobservationtypedetails',
    getIsObservationConfigurationCompleted: 'api/hse/configuration/getisobservationconfigurationcompleted',
    getObservationCategoryDetails: 'api/hse/configuration/getobservationcategorydetails',
    saveObservationCategoryDetails: 'api/hse/configuration/saveobservationcategorydetails',
    deleteObservationCategoryDetails: 'api/hse/configuration/deleteobservationcategorydetails',
    getNoOfRoleAssignedToUser: 'api/common/configuration/getnoofroleassignedtouser',
    saveUserRoleMapping: 'api/common/configuration/saveuserrolemapping',
    getUserRoleMappingDetails: 'api/hse/configuration/getuserrolmappingdetails',
    deleteUserRoleMappingDetails: 'api/hse/configuration/deleteuserrolemappingdetails',
    getRaiseRequestCountForUserId: 'api/hse/configuration/getraiserequestcountforuserId'
  };

  // Constants for email notification service
  public static EmailConstants = {
    ConfigurationKey: 'ReminderMailDays'
  };

  public static ActiveInActiveStatuses = {
    Active : 'Active',
    InActive: 'InActive'
  };

  // Gender details
  GenderList = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
}
