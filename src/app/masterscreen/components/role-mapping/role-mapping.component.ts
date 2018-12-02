import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { RoleMappingModel, RoleMappingModelGet } from '../../model/role-mapping.model';
import { CompanyDetails } from '../../model/admin-master.model';
import { SearchText } from '../../../observation/model/searchTexts.model';
import { User } from '../../../observation/model/user.model';
import { UserRole } from '../../model/user-role.model';


import { BaseService } from '../../../shared/services/base.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { CommonService } from '../../../shared/services/common.service';
import { MasterscreenService } from '../../services/masterscreen.service';
import { MasterscreenConstantsService } from '../../services/masterscreen-constants.service';

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.css']
})
export class RoleMappingComponent implements OnInit {

  roleMappingDetails: RoleMappingModel;
  @Input() companyDetailsResponse: any;
  @Input() companyList: any;
  userTypes: any;
  searchTexts: SearchText;
  loggedInUserJSON: any;
  user = new User();
  userResults: User[] = [];
  roleList: SelectItem[];
  noOfRoleAssignedToUser: number;
  userRoleDetails: UserRole;
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  roleMappingDetailsResponse: RoleMappingModelGet[];
  raiseRequetsCount: number;
  EmployeeName: string;
  RoleName: string;
  EmployeeId: number;
  RoleId: number;
  isUserSelected: boolean = false;
  selectedUserEmp: any;
  selectedRoleName: string;
  hseAdvisorRole: string;
  constructor(private commonService: CommonService,
    private baseService: BaseService,
    private masterscreenService: MasterscreenService) {
    this.roleMappingDetails = new RoleMappingModel();
    this.companyList = [];
    this.searchTexts = new SearchText();
    this.userRoleDetails = new UserRole();
    this.roleMappingDetailsResponse = [];
    this.hseAdvisorRole = ConstantsService.UserRole.HSEAdvisor;
  }


  // Reset field value
  resetValue() {
    this.roleMappingDetails = new RoleMappingModel();
    this.isUserSelected = false;
    this.selectedUserEmp = null;
    this.userRoleDetails.userId = null;
    this.ngOnInit();
    this.alertType = null;
    this.errorDetails = null;
    this.successDetails = null;
    this.confirmMessage = null;
    this.noOfRoleAssignedToUser = null;
  }

  // Funtion to set value on selection and pass to event
  onYesClickedForConfirmation() {
    this.alertType = '';
    this.confirmMessage = '';
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        UserId: this.EmployeeId,
        RoleId: this.RoleId
      }
    };
    this.masterscreenService.deleteUserRoleMappingDetails(apiRequest, this.callbackMethodForDeleteUserRoleMappingDetails.bind(this));
  }

  callbackMethodForDeleteUserRoleMappingDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = MasterscreenConstantsService.Message.DeleteUserRoleMapping.replace('{0}', this.EmployeeName.toString()).
        replace('{1}', this.RoleName.toString());
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
      this.baseService.processApiResponseError(response);
    }
    this.baseService.showRootLoader = false;
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
  }

  //#region - Delete user role mappping
  deleteUserRoleMappingDetails(roleDetails, index) {
    this.baseService.showRootLoader = true;
    // Set temporary varaible for displaying employee and role name in pop up
    this.EmployeeName = roleDetails.UserDetails.FullName;
    this.RoleName = roleDetails.RoleDetails.RoleName;
    this.EmployeeId = roleDetails.UserDetails.UserId;
    this.RoleId = roleDetails.RoleDetails.RoleId;
    // First, Get the raise request count against user id - After Checking count of request(Delete the requests)
    const apiRequest = {
      Model: {
        UserId: roleDetails.UserDetails.UserId
      }
    };
    this.masterscreenService.getRaiseRequestCountForUserId(apiRequest, this.callbackMethodForGetRaiseRequestCountForUserId.bind(this));
  }

  /**
* Callback method to get count of raise request against user id
* @param response - response of request.
*/
  callbackMethodForGetRaiseRequestCountForUserId(response) {
    if (response && response.Success) {
      this.raiseRequetsCount = response.Result;
      if (this.raiseRequetsCount > 0) {
        this.alertType = ConstantsService.Success;
        this.successDetails = MasterscreenConstantsService.Message.RaiseCountExceededForHseAdviser
          .replace('{0}', this.EmployeeName.toString())
          .replace('{1}', this.raiseRequetsCount.toString())
          .replace('{2}', this.EmployeeName.toString());
      } else {
        this.alertType = ConstantsService.Confirm;
        this.confirmMessage = MasterscreenConstantsService.Message.DeleteConfirmationRoleMapping.
          replace('{0}', this.RoleName.toString());
      }
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.baseService.showRootLoader = false;
  }
  //#endregion

  //#region - save role mapping in user role mapped table
  saveRoleMapping() {
    this.baseService.showRootLoader = true;
    // If user is selected from people picker
    if (this.userRoleDetails.userId) {
      const apiRequest = {
        Model: {
          UserId: this.userRoleDetails.userId,
          RoleId: this.roleMappingDetails.roleId
        }
      };
      this.masterscreenService.saveUserRoleMapping(apiRequest, this.callbackMethodForUserRoleMapping.bind(this));
    } else {
      this.isUserSelected = true;
      this.baseService.showRootLoader = false;
    }
  }

  callbackMethodForUserRoleMapping(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = MasterscreenConstantsService.Message.SucceessRoleMapping;
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  // #region - Check Assigned role to User
  checkNoOfRoleAssignedToUser(event) {
    this.baseService.showRootLoader = true;
    // Get object of role list and get the selected name of dropdown list
    const roleObject = this.roleList.find((role) => role.value === event.value);
    this.selectedRoleName = roleObject.label;
    const apiRequest = {
      Model: {
        RoleId: this.roleMappingDetails.roleId,
        CompanyId: this.roleMappingDetails.companyId
      }
    };
    this.masterscreenService.checkNoOfRoleAssignedToUser(apiRequest, this.callbackMethodForCheckAssignedRoleToUser.bind(this));
  }

  callbackMethodForCheckAssignedRoleToUser(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.noOfRoleAssignedToUser = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  //#region - people picker to get Employee(s)
  getUsersOnSearch(event) {
    this.userTypes.forEach(user => {
      if (user.UserType === MasterscreenConstantsService.UserType.Employee) {
        this.searchTexts.UserTypeId = user.UserTypeId;
      }
    });
    this.searchTexts.FilterTexts = event.query;
    this.searchTexts.CompanyId = this.roleMappingDetails.companyId;
    const apiRequest = {
      Model: this.searchTexts
    };
    this.commonService.getSearchResultsForUsers(apiRequest, this.callbackMethodForGetSearchResultsForUsersData.bind(this));
  }

  // call back method of employee on search
  callbackMethodForGetSearchResultsForUsersData(response) {
    if (response && response.Success) {
      const filtered: any[] = [];
      for (let index = 0; index < response.Result.length; index++) {
        this.user = response.Result[index];
        if (this.user.FullName.toLowerCase().indexOf(this.searchTexts.FilterTexts.toLowerCase()) === 0) {
          filtered.push(this.user);
        }
      }
      this.userResults = filtered;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }

  // method to get id of selected employee
  selectUser(event) {
    this.userRoleDetails.userId = event.UserId;
  }

  resetPeoplePicker() {
    this.userRoleDetails.userId = null;
  }
  //#endregion

  //#region - To get All User type
  getUserTypes() {
    this.commonService.getUserTypes(this.callbackMethodForGetUserTypes.bind(this));
  }

  // call back mathod of get user type
  callbackMethodForGetUserTypes(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.userTypes = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion - end get all user type

  //#region - To get All role name
  getListOfRoleName() {
    this.commonService.getListOfRoleName(this.callbackMethodForGetListOfRoleName.bind(this));
  }

  // call back mathod of get all role name
  callbackMethodForGetListOfRoleName(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      const roleDetailsResponse = response.Result;
      this.roleList = [];
      roleDetailsResponse.forEach((item) => {
        // Convert Role into label and value pair
        this.roleList.push(
          {
            label: item.RoleName,
            value: item.RoleId
          }
        );
      });
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion - end get all user type

  //#region - Get User Role mapping for all user
  getUserRoleMappingDetails() {
    // Get all hazard data and show into contractor page grid
    this.masterscreenService.getUserRoleMappingDetails(this.callbackMethodForGetUserRoleMappingDetails.bind(this));
  }

  callbackMethodForGetUserRoleMappingDetails(response) {
    if (response && response.Success) {
      this.roleMappingDetailsResponse = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

  // navigate to welcome page
  navigateToWelcomePage() {
    this.baseService.navigateToUrl(ConstantsService.URL.MasterScreen);
  }

  ngOnInit() {
    this.baseService.showRootLoader = true;
    const loggedInUser = this.baseService.getItemFromSession(ConstantsService.commonConstants.loggedInUser);
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.getUserTypes();
    this.getListOfRoleName();
    this.getUserRoleMappingDetails();
  }
}

