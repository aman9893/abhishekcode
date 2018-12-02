import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ObservationTypesModel } from '../../model/observation-types.model';
import { MasterscreenService } from '../../services/masterscreen.service';
import { BaseService } from '../../../shared/services/base.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { MasterscreenConstantsService } from '../../services/masterscreen-constants.service';

@Component({
  selector: 'app-observation-types',
  templateUrl: './observation-types.component.html',
  styleUrls: ['./observation-types.component.css']
})
export class ObservationTypesComponent implements OnInit, OnChanges {

  observationDetails: ObservationTypesModel = new ObservationTypesModel();
  sourceCompanyList: any[];
  targetCompanyList: any[];
  @Input() companyDetailsResponse: any[];
  @Input() companyList: any[];
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  observationTypeDetailsResponse: any;
  isObservationTypesEdit = true;
  deleteRecord = false;
  status: any[];
  validationforPickList = false;
  isObservationTypeActive: boolean = false;
  isShowDeleteButton: false;

  constructor(public masterscreenService: MasterscreenService,
    public baseService: BaseService) {
    // Initialize PickList
    this.sourceCompanyList = [];
    this.targetCompanyList = [];
    // Initialize observation details response
    this.observationTypeDetailsResponse = [];
    // Initialize status
    this.status = [
      { label: MasterscreenConstantsService.ActiveInActiveStatuses.Active , value: false },
      { label: MasterscreenConstantsService.ActiveInActiveStatuses.InActive, value: true },
    ];
    this.observationDetails.selectedCompanyIds = [];
    this.errorDetails = [];
  }

  //#region - Confirmation pop-up
  /**
  * Callback method of delete Observation Type
  * @param response - response of request.
  */
  callbackMethodForDeleteObservationTypeDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = MasterscreenConstantsService.Message.DeleteObservation;
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
      this.baseService.processApiResponseError(response);
    }
    this.baseService.showRootLoader = false;
  }

  // Funtion to set value on selection and pass to event
  onYesClickedForConfirmation() {
    this.alertType = '';
    this.confirmMessage = '';
    // on click on confirmation box 'Y', then call api to delete records
    if (this.isObservationTypeActive) {
    this.saveObservationTypeDetails();
    } else {
      this.deleteRecord = true;
      this.baseService.showRootLoader = true;
      const apiRequest = {
        Model: {
          'observationTypeId': this.observationDetails.observationTypeId
        }
      };
      this.masterscreenService.deleteObservationTypeDetails(apiRequest, this.callbackMethodForDeleteObservationTypeDetails.bind(this));
    }
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    this.isObservationTypeActive = false;
    this.observationDetails.InActive = false;
  }

  //#endregion for configuration pop-up

  //#region - Delete Observation type based on observation Id
  /**
      * Delete Observation type details
      * @param observationType - Observation type details request.
      * @param index - index of row
      */
  deleteObservationTypeDetails(observationType, index) {
    this.deleteRecord = true;
    this.alertType = 'Confirm';
    this.confirmMessage = MasterscreenConstantsService.Message.DeleteConfrmationObservation;
    this.observationDetails.observationTypeId = observationType.ObservationTypeId;
  }
  //#endregion

  //#region - Edit Observation Type
  /**
  * Edit Observation Type
  * @param ObservationType - Observation Type request.
  * @param index - index of row
  */
  editObservationTypeDetails(observationType, index) {
    this.isObservationTypesEdit = false;
    this.validationforPickList = false;
    this.observationDetails.observationTypeId = observationType.ObservationTypeId;
    this.observationDetails.observationTypeName = observationType.ObservationTypeName;
    if (observationType.InActive === MasterscreenConstantsService.ActiveInActiveStatuses.Active) {
      this.observationDetails.InActive = false;
    } else {
      this.observationDetails.InActive = true;
    }
    this.targetCompanyList = [];
    this.targetCompanyList.push(
      {
        'companyName': observationType.CompanyDetails.CompanyName,
        'companyId': observationType.CompanyDetails.CompanyId
      });
    // Setting data into model for API
    this.observationDetails.selectedCompanyIds = this.targetCompanyList.map(function (a) {
      return a.companyId;
    });
    this.ngOnChanges();
    // Get SourceList Data based on company Id
    this.sourceCompanyList = this.sourceCompanyList.filter(sList =>
      sList.companyId !== this.targetCompanyList[0].companyId
    );
  }
  //#endregion

  //#region - selectStatus check the status and display confirmation pop-up
  selectStatus(status: boolean) {
    if (status === true) {
      this.isObservationTypeActive = true;
      // this.alertType = 'Confirm';
      // this.confirmMessage = MasterscreenConstantsService.Message.SelectConfirmationForActive;
    } else {
      this.isObservationTypeActive = false;

    }
  }
  //#endregion

  //#region - Save Observation Types
  /**
       * Method for save observation types details.
       * @param isUpdatedObservationTypes - Use for new entry or update entry.
       */
      CheckIsObservationTypeActiveSaveObservationTypeDetails(isUpdatedObservationTypes) {
    this.observationDetails.isUpdatedObservationTypes = isUpdatedObservationTypes;
    if (isUpdatedObservationTypes === 0) {
      this.observationDetails.observationTypeId = 0;
      this.observationDetails.InActive = false;
    }
    if (this.isObservationTypeActive) {
this.alertType = 'Confirm';
      this.confirmMessage = MasterscreenConstantsService.Message.SelectConfirmationForActive;
    } else {
      this.saveObservationTypeDetails();
    }
    // Validation to display message on fields

  }
  saveObservationTypeDetails() {
    if (this.observationDetails.selectedCompanyIds.length === 0) {
      this.validationforPickList = true;
    } else {
      this.baseService.showRootLoader = true;
      this.validationforPickList = false;
      const apiRequest = {
        Model: this.observationDetails
      };
      this.masterscreenService.saveObservationTypeDetails(apiRequest, this.callbackMethodForSaveObservationTypeDetails.bind(this));
    }


  }
  /**
* Callback method of Save Observation Type details.
* @param response - response of request.
*/
  callbackMethodForSaveObservationTypeDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      // this.successDetails = 'Observation Details Submitted successfully';
      this.successDetails = this.observationDetails.isUpdatedObservationTypes ? MasterscreenConstantsService.Message.UpdateObservation
        : MasterscreenConstantsService.Message.SuccessObservation;
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
    this.baseService.showRootLoader = false;
  }

  //#endregion

  //#region - Section for Pick List
  onMoveToTargetDetails(event) {
    this.observationDetails.selectedCompanyIds = this.targetCompanyList.map(function (a) {
      return a.companyId;
    });
    // set validation if selectedCompanyIds is empty
    if (this.observationDetails.selectedCompanyIds.length === 0) {
      this.validationforPickList = true;
    } else {
      this.validationforPickList = false;
    }
  }

  onMoveToSourceDetails(event) {
    this.observationDetails.selectedCompanyIds = this.targetCompanyList.map(function (a) {
      return a.companyId;
    });
    // check for validation if targetist is empty
    if (this.observationDetails.selectedCompanyIds.length === 0) {
      this.validationforPickList = true;
    }
  }
  //#endregion - Section for Pick List

  //#region - Reset and Set Value into Grid
  resetValue() {
    this.observationDetails = new ObservationTypesModel();
    this.targetCompanyList = [];
    this.isObservationTypesEdit = true;
    this.ngOnInit();
    this.ngOnChanges();
    this.alertType = null;
    this.errorDetails = null;
    this.successDetails = null;
    this.confirmMessage = null;
  }
  //#endregion

  //#region - onInit event- get the details of observation type
  ngOnInit() {
    // Get all observation type data and show into page grid
    this.masterscreenService.getObservationTypeDetails(null, this.callbackMethodForGetObservationTypeDetails.bind(this));
  }

  /**
 * Callback method of observation type details.
 * @param response - response of request.
 */
  callbackMethodForGetObservationTypeDetails(response) {
    if (response && response.Success) {
      this.observationTypeDetailsResponse = response.Result;
      this.observationTypeDetailsResponse.forEach((item) => {
        if (item.InActive === true) {
          item.InActive = MasterscreenConstantsService.ActiveInActiveStatuses.InActive;
          item.isShowDeleteButton = false;
        } else {
          item.InActive = MasterscreenConstantsService.ActiveInActiveStatuses.Active;
          item.isShowDeleteButton = true;

        }
      });
    } else {
      this.baseService.processApiResponseError(response);
    }
  }
  //#endregion

    // navigate to welcome page
    navigateToWelcomePage() {
      this.baseService.navigateToUrl(ConstantsService.URL.MasterScreen);
    }

  //#region - onChange event- set sourceCompanyList Data if its Active company on
  ngOnChanges() {
    this.sourceCompanyList = [];
    this.companyDetailsResponse.filter((item) => {
      if (item.InActive === MasterscreenConstantsService.ActiveInActiveStatuses.Active) {
        this.sourceCompanyList.push({
          'companyName': item.CompanyName,
          'companyId': item.CompanyId
        });
      }
    });
  }
  //#endregion
}
