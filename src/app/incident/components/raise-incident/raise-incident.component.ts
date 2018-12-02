import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { BaseService } from '../../../shared/services/base.service';
import { ObservationService } from '../../../observation/services/observation.service';
import { SearchText } from '../../../observation/model/searchTexts.model';
import { HseErrorHandlerService } from '../../../shared/services/hse-error-handler.service';
import { Usertypes } from '../../../observation/model/usertypes.model';
import { IncidentConstantsService } from '../../services/incident-constants-service';
import { CommunicationSource } from '../../model/communicationSource.model';
import { IncidentCategory } from '../../model/incidentCategory.model';
import { IncidentType } from '../../model/incidentType.model';
import { IncidentRequest } from '../../model/incidentRequest.model';
import { PeopleInvolved } from '../../model/peopleInvolved.model';
import { SpilDetails } from '../../model/spilDetails.model';
import { IncidentRequestPost } from '../../model/incidentRequestPost.model';
import { Login } from '../../../observation/model/login.model';
import { ConstantsService } from './../../../shared/services/constants.service';
import { Company } from '../../../observation/model/company.model';
import { IncidentService } from '../../services/incident.service';
import { RiskConstantsService } from '../../../risk/services/risk-constants.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';


@Component({
  selector: 'app-raise-incident',
  templateUrl: './raise-incident.component.html',
  styleUrls: ['./raise-incident.component.css']
})
export class RaiseIncidentComponent implements OnInit {
  selectedUserEmp: User;
  incidentId: number;
  selectedGeneralManager: User;
  successDetails: string;
  loggedInUserJSON: any;
  searchTexts: SearchText;
  user: User;
  employee: User;
  company: any = {};
  locations: any[];
  incidentType: IncidentType[] = [];
  login: Login;
  people: PeopleInvolved;
  spilDetail: SpilDetails;
  spilDetails: SpilDetails[] = [];
  peopleInvolved: PeopleInvolved[] = [];
  userResults: User[] = [];
  userTypes: Usertypes[] = [];
  incidet: string;
  incidentRequest: IncidentRequest;
  communicationSource: CommunicationSource[] = [];
  errorDetails: any;
  incidentCategory: IncidentCategory[] = [];
  selectedincidentCategoryId: number[] = [];
  selectedincidentTypeId: number[] = [];
  alertType: string;
    sub: any;
  inputFile: string;
  display: boolean = false;
  pearMaster = [];
  severityMaster = [];
  validate: boolean = true;
  isIncidentReportErrorMsg: boolean = false;
  isIncidenttakingErrorMsg: boolean = false;
  isReportedviamsg: boolean = false;
  isIncidentDateErrorMsg: boolean = false;
  isLocationMsg: boolean = false;
  isSpecificLocationMsg:  boolean = false;
  isInitialKnownMsg: boolean = false;
  isIncidentCategory: boolean = false;
  isShowpearErrorMsg: boolean = false;
  isSeverityErrorMsg: boolean = false;
  isClassificationErrorMsg: boolean = false;
  isOwnerErrorMsg: boolean = false;
  isActiontakenMsg: boolean = false;
  isCauseMsg: boolean = false;
  isIPStatusMsg: boolean = false;
  isInitialClassification: boolean = false;
  isemployeeErrorMsg: boolean = false;
  isJobErrorMsg: boolean = false;
  isInjuryErrorMsg: boolean = false;
  isEquipmentErrorMsg: boolean = false;
  istagErrorMsg: boolean = false;
  isDescriptionMsg: boolean = false;
  isIncidentType: boolean = false;
  routesFlag: { routeName: string, routeURL: string }[];
  reportRoutes: { routeName: string, routeURL: string }[];

  constructor(private observationService: ObservationService,
    private baseService: BaseService,
    private route: ActivatedRoute,
    private hseErrorHandler: HseErrorHandlerService,
    private incidentConstantsService: IncidentConstantsService,
    private router: Router,
    private incidentService: IncidentService) {
    this.searchTexts = new SearchText();
    this.incidentRequest = new IncidentRequest();
    this.incidentRequest.IncidentRequest = new IncidentRequestPost();
    this.user = new User();
    this.login = new Login();
  }

  ngOnInit() {
    this.communicationSource = IncidentConstantsService.CommunicationSource.CommunicationSource;
    this.pearMaster = RiskConstantsService.Pear;
    this.severityMaster = RiskConstantsService.Severity;
    const loggedInUser = this.baseService.getItemFromSession('loggedInUser');
    this.loggedInUserJSON = JSON.parse(loggedInUser);
    this.routesFlag = IncidentConstantsService.IncidentNavigation.InnerRoutes;
    this.reportRoutes = IncidentConstantsService.IncidentNavigation.ReportRoutes;
    this.people = new PeopleInvolved();
    this.people.User = new User();
    this.employee = new User();
    this.peopleInvolved.push(this.people);
    this.spilDetail = new SpilDetails();
    this.spilDetails.push(this.spilDetail);
    this.login.CompanyId = this.loggedInUserJSON.Company.CompanyId;
    this.login.ID = this.loggedInUserJSON.UserId;
     this.sub = this.route.params.subscribe(params => {
      this.incidentId = +params['incidentId'];
    });
    this.getcompany();
    this.getIncidentTypeByCompanyId();
    this.getIncidentCategoryByCompanyId();
    this.getLocation();
    this.getUserTypes();
  }
  // method to get company name
  getcompany() {
    if (this.login) {
      const apiRequest = {
        Model: this.login
      };
      this.observationService.getCompanyData(apiRequest, this.callbackMethodForgetCompanyData.bind(this));
    }
  }

  // call back method of company name
  callbackMethodForgetCompanyData(response) {
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      this.company = response.Result;
    }
    if (response.Result.CompanyId === 0) {

      console.log('Company Id not found.');
      this.display = true;
    }
  }
  // method to get the location
  getLocation() {
    if (this.login) {
      const apiRequest = {
        Model: this.login
      };
      // Call dummy method to post data
      this.observationService.getLocationData(apiRequest, this.callbackMethodForGetLocationData.bind(this));
    }
  }

  // call back method of get location
  callbackMethodForGetLocationData(response) {
    if (response === undefined) {
      this.serviceError();
    }
    if (response.Success) {
      this.locations = [];
      const locationDetails = response.Result;
      locationDetails.forEach((location) => {
        this.locations.push(
          {
            'label': location.LocationName,
            'value': location.LocationId
          }
        );
      });

    }
    if (response.Errors !== null) {
      this.alertType = ConstantsService.Error;
      this.errorDetails = 'Location list is empty.';
      this.display = true;
      this.hseErrorHandler.handleError(response.Errors);
    }
  }
  getUserTypes() {
    this.observationService.getUserTypes(this.callbackMethodForgetUserTypes.bind(this));
  }
  callbackMethodForgetUserTypes(response) {
    if (response.Error != null) {
      this.hseErrorHandler.handleError(response.Error);
    }

    if (response.Success) {
      this.userTypes = response.Result;
    }

     if (!isNaN(this.incidentId)) {
      this.getIncidentDataByIncidentId();
    }
  }
 getIncidentDataByIncidentId() {
    const apiRequest = {
      Model: {
        IncidentRequestId: this.incidentId
      }
    };
    this.incidentService.getIncidentDataByIncidentId(apiRequest, this.callbackMethodForgetIncidentDataByIncidentId.bind(this));
  }
callbackMethodForgetIncidentDataByIncidentId(response) {
this.incidentRequest.IncidentRequest = response.Result;
this.selectedUserEmp = response.Result.RaisedBy;
this.selectedGeneralManager = response.Result.CaseOwner;
this.incidentRequest.IncidentRequest.LocationId = response.Result.Location.LocationId;
 this.incidentRequest.IncidentRequest.IncidentDate = new Date( this.incidentRequest.IncidentRequest.IncidentDate);
this.peopleInvolved = response.Result.PeopleInvolved;
this.spilDetails = response.Result.SpilDetails;
this.selectedincidentTypeId = this.incidentRequest.IncidentRequest.SelectedIncidentTypeIds;
this.selectedincidentTypeId.forEach( incidenttype => {
this.incidentType.forEach( incident => {
if (incidenttype === incident.IncidentTypeId ) {
incident.Checked = true;
}
});
});

this.selectedincidentCategoryId = this.incidentRequest.IncidentRequest.SelectedIncidentCategoryIds;
this.selectedincidentCategoryId.forEach( incidentcategory => {
this.incidentCategory.forEach( incident => {
if (incidentcategory === incident.IncidentCategoryId ) {
incident.Checked = true;
}
});
});
this.getIncidentColorClass();
}
  // method to get Employee's and Contractors name
  getUsersOnSearch(event) {
    this.userTypes.forEach(userType => {
      if (userType.UserType === 'Employee') {
        this.searchTexts.UserTypeId = userType.UserTypeId;
      }
    });
    if (this.loggedInUserJSON) {
      if (typeof event === 'string' || event instanceof String) {
        this.searchTexts.FilterTexts = '';
      } else {
        this.searchTexts.FilterTexts = event.query;
      }
      this.searchTexts.CompanyId = this.loggedInUserJSON.Company.CompanyId;
      const apiRequest = {
        Model: this.searchTexts
      };
      this.observationService.getSearchResultsForUsers(apiRequest, this.callbackMethodForGetSearchResultsForUsersData.bind(this));
    }
  }
  // Shows error message when service is not available ( WebAPIs are not in running mode)
  serviceError() {
    this.hseErrorHandler.handleError('Service (WebAPI) is not available or not in running mode');
  }
  // call back method of employee on search
  callbackMethodForGetSearchResultsForUsersData(response) {
    if (response === undefined) {
      this.serviceError();
    }

    if (response.Success) {
      const filtered: any[] = [];
      for (let i = 0; i < response.Result.length; i++) {
        this.user = response.Result[i];
        if (this.user.FullName.toLowerCase().indexOf(this.searchTexts.FilterTexts.toLowerCase()) === 0) {
          filtered.push(this.user);
        }
      }
      this.userResults = filtered;
    }

    if (response.Errors !== null) {
      this.hseErrorHandler.handleError(response.Errors);
    }
  }
   // method to check the validation
   checkValidation() {
    this.validate = true;

     if (!this.selectedUserEmp) {
      this.isIncidentReportErrorMsg = true;
      this.validate = false;
     }
     if (!this.incidentRequest.IncidentRequest.CommunicationSource) {
      this.isReportedviamsg = true;
      this.validate = false;
    }
     if (!this.incidentRequest.IncidentRequest.ActivityTakingAtIncident) {
      this.isIncidenttakingErrorMsg = true;
      this.validate = false;
    }
    if (!this.incidentRequest.IncidentRequest.IncidentDate) {
      this.isIncidentDateErrorMsg = true;
      this.validate = false;
    }
    if (!this.incidentRequest.IncidentRequest.LocationId) {
    this.isLocationMsg = true;
    this.validate = false;
    }
    if (!this.incidentRequest.IncidentRequest.SpecificLocation) {
      this.isSpecificLocationMsg = true;
      this.validate = false;
      }

    if (!this.incidentRequest.IncidentRequest.InitalFact) {
      this.isInitialKnownMsg = true;
      this.validate = false;
      }
    if (!this.selectedincidentCategoryId.length) {
        this.isIncidentCategory = true;
        this.validate = false;
        }
    if (this.incidentRequest.IncidentRequest.Pear.trim() === '0') {
        this.isShowpearErrorMsg = true;
        this.validate = false;
        }
    if (this.incidentRequest.IncidentRequest.Severity === 0 || this.incidentRequest.IncidentRequest.Severity.toString() === '0') {
        this.isSeverityErrorMsg = true;
        this.validate = false;
        }
    if (!this.incidentRequest.IncidentRequest.RationaleClassification) {
        this.isClassificationErrorMsg = true;
        this.validate = false;
        }
    if (!this.selectedGeneralManager) {
        this.isOwnerErrorMsg = true;
        this.validate = false;
        }
    if (!this.incidentRequest.IncidentRequest.ActionTaken) {
        this.isActiontakenMsg = true;
        this.validate = false;
        }
    if (!this.incidentRequest.IncidentRequest.ImmediateCause) {
        this.isCauseMsg = true;
        this.validate = false;
        }
    if (!this.incidentRequest.IncidentRequest.IPStatus) {
        this.isIPStatusMsg = true;
        this.validate = false;
        }
    if (!this.selectedincidentTypeId.length) {
          this.isIncidentType = true;
          this.validate = false;
      }
    if (!this.incidentRequest.IncidentRequest.InitalClassification) {
        this.isInitialClassification = true;
        this.validate = false;
        }
    if (!this.people.User.UserId) {
        this.isemployeeErrorMsg = true;
        this.validate = false;
        }
    if (!this.people.Job) {
        this.isJobErrorMsg = true;
        this.validate = false;
        }
    if (!this.people.Injury) {
        this.isInjuryErrorMsg = true;
        this.validate = false;
        }
    if (!this.spilDetail.Equip) {
        this.isEquipmentErrorMsg = true;
        this.validate = false;
        }
    if (!this.spilDetail.Tag) {
        this.istagErrorMsg = true;
        this.validate = false;
        }
    if (!this.spilDetail.Description) {
        this.isDescriptionMsg = true;
        this.validate = false;
        }
    if (this.validate === true) {
       this.raiseIncident();
        }
   }

  raiseIncident() {
    for (let i = 0; i < this.peopleInvolved.length; i++) {
      this.peopleInvolved[i].UserId = this.peopleInvolved[i].User.UserId;
    }
    this.incidentRequest.PeopleInvolved = this.peopleInvolved;
    this.incidentRequest.SpilDetails = this.spilDetails;
    this.incidentRequest.IncidentRequest.FileUrl = this.inputFile;
    this.incidentRequest.IncidentRequest.RaisedBy = this.loggedInUserJSON.UserId;
    this.incidentRequest.IncidentRequest.IncidentObserveBy = this.selectedUserEmp.UserId;
    this.incidentRequest.IncidentRequest.CaseOwnerAppointment = this.selectedGeneralManager.UserId;
    this.incidentRequest.IncidentRequest.SelectedIncidentCategoryIds = this.selectedincidentCategoryId;
    this.incidentRequest.IncidentRequest.SelectedIncidentTypeIds = this.selectedincidentTypeId;
    const apiRequest = {
      Model: this.incidentRequest
    };
    if (!isNaN(this.incidentId)) {
      apiRequest.Model.IncidentRequest.IncidentRequestId = this.incidentId;
        this.incidentService.updateIncident(apiRequest, this.callbackMethodForRaiseIncident.bind(this));
      } else {
        // Call dummy method to post data
           this.incidentService.raiseIncident(apiRequest, this.callbackMethodForRaiseIncident.bind(this));
      }
  }

  callbackMethodForRaiseIncident(response) {
if (response && response.Success) {
      // show success message
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Incident details has been added successfully';
    }
    if (response.Errors !== null) {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
  }

  //#region- get incident Type from configuration
  getIncidentTypeByCompanyId() {
    const apiRequest = {
      Model: {
        'CompanyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.incidentService.getIncidentTypeByCompanyId(apiRequest, this.callbackMethodForGetIncidentTypeDetails.bind(this));
  }

  /**
* Callback method of observation type details.
* @param response - response of request.
*/
  callbackMethodForGetIncidentTypeDetails(response) {
    if (response && response.Success) {
      this.incidentType = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }

  //#region- get incident Type from configuration
  getIncidentCategoryByCompanyId() {
    const apiRequest = {
      Model: {
        'CompanyId': this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get all observation type data
    this.incidentService.getIncidentCategoryByCompanyId(apiRequest, this.callbackMethodForGetIncidentCategoryDetails.bind(this));
  }

  /**
* Callback method of observation type details.
* @param response - response of request.
*/
  callbackMethodForGetIncidentCategoryDetails(response) {
    if (response && response.Success) {
      this.incidentCategory = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  reset() {
    this.selectedUserEmp = new User();
    this.selectedGeneralManager = new User();
    this.incidentRequest.IncidentRequest = new IncidentRequestPost();
    this.peopleInvolved = [];
    this.spilDetails = [];
    this.addPeople();
    this.addspilDetails();
  }
  addPeople() {
    this.people = new PeopleInvolved();
    this.peopleInvolved.push(this.people);
  }
  removePeople(index) {
    this.peopleInvolved.splice(index, 1);
  }
  addspilDetails() {
    this.spilDetail = new SpilDetails();
    this.spilDetails.push(this.spilDetail);
  }
  removespilDetails(index) {
    this.spilDetails.splice(index, 1);
  }
  SubmitCheckedIncidentCategory(incidentCategory, event) {
    if (event.target.checked) {
      this.selectedincidentCategoryId.push(incidentCategory.IncidentCategoryId);
    } else {
      const index = this.selectedincidentCategoryId.indexOf(incidentCategory.IncidentCategoryId);
      if (index > -1) {
        this.selectedincidentCategoryId.splice(index, 1);
      }
    }
  }

  SubmitCheckedIncidentType(incidentType, event) {
    if (event.target.checked) {
      this.selectedincidentTypeId.push(incidentType.IncidentTypeId);
    } else {
      const index = this.selectedincidentTypeId.indexOf(incidentType.IncidentTypeId);
      if (index > -1) {
        this.selectedincidentTypeId.splice(index, 1);
      }
    }
  }
  getIncidentColorClass() {
    this.incidet = this.incidentService.getIncidentColorClass(this.incidentRequest.IncidentRequest.Severity,
      this.incidentRequest.IncidentRequest.Pear);
  }
  // call when you click on ok of msg popup
  onYesClickedForConfirmation() {
    this.router.navigate([IncidentConstantsService.RoutingURLConstant.IncidentDashBoardURL]);
  }
}
