import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ObservationCategoryModel } from '../../model/observation-category.model';
import { MasterscreenService } from '../../services/masterscreen.service';
import { BaseService } from '../../../shared/services/base.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { MasterscreenConstantsService } from '../../services/masterscreen-constants.service';

@Component({
  selector: 'app-observation-category',
  templateUrl: './observation-category.component.html',
  styleUrls: ['./observation-category.component.css']
})
export class ObservationCategoryComponent implements OnInit, OnChanges {

  observationCategoryDetails: ObservationCategoryModel = new ObservationCategoryModel();
  sourceCompanyList: any[];
  targetCompanyList: any[];
  @Input() companyDetailsResponse: any[];
  @Input() companyList: any[];
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  observationCategoryDetailsResponse: any;
  isObservationCategoryEdit = true;
  deleteRecord = false;
  status: any[];
  validationforPickList = false;
  isObservationCategoryActive: boolean = false;

  constructor(public masterscreenService: MasterscreenService,
    public baseService: BaseService) {
    // Initialize PickList
    this.sourceCompanyList = [];
    this.targetCompanyList = [];
    // Initialize observation details response
    this.observationCategoryDetailsResponse = [];
    // Initialize status
    this.status = [
      { label: 'Active', value: false },
      { label: 'InActive', value: true },
    ];
    this.observationCategoryDetails.selectedCompanyIds = [];
    this.errorDetails = [];
  }

  //#region - Confirmation pop-up
  /**
  * Callback method of delete Observation Category
  * @param response - response of request.
  */
  callbackMethodForDeleteObservationCatDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = MasterscreenConstantsService.Message.DeleteObservationCategory;
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
    if (this.isObservationCategoryActive) {
      this.saveObservationCategoryDetails();
    } else {
      this.deleteRecord = true;
      this.baseService.showRootLoader = true;
      const apiRequest = {
        Model: {
          observationCategoryId: this.observationCategoryDetails.observationCategoryId
        }
      };
      this.masterscreenService.deleteObservationCategoryDetails(apiRequest, this.callbackMethodForDeleteObservationCatDetails.bind(this));
    }
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    this.observationCategoryDetails.InActive = false;
  }

  //#endregion for configuration pop-up

  //#region - Delete Observation Category based on observation Id
  /**
      * Delete Observation category details
      * @param observationCategory - Observation category details request.
      * @param index - index of row
      */
  deleteObservationCategoryDetails(observationCategory, index) {
    this.deleteRecord = true;
    this.alertType = 'Confirm';
    this.confirmMessage = MasterscreenConstantsService.Message.DeleteConfrmationObservationCategory;
    this.observationCategoryDetails.observationCategoryId = observationCategory.ObservationCategoryId;
  }
  //#endregion

  //#region - Edit Observation Category
  /**
  * Edit Observation Category
  * @param observationCategory - Observation Category request.
  * @param index - index of row
  */
  editObservationCategoryDetails(observationCategory, index) {
    this.isObservationCategoryEdit = false;
    this.validationforPickList = false;
    this.observationCategoryDetails.observationCategoryId = observationCategory.ObservationCategoryId;
    this.observationCategoryDetails.observationCategoryName = observationCategory.ObservationCategoryName;
    if (observationCategory.InActive === 'Active') {
      this.observationCategoryDetails.InActive = false;
    } else {
      this.observationCategoryDetails.InActive = true;
    }
    this.targetCompanyList = [];
    this.targetCompanyList.push(
      {
        'companyName': observationCategory.CompanyDetails.CompanyName,
        'companyId': observationCategory.CompanyDetails.CompanyId
      });
    // Setting data into model for API
    this.observationCategoryDetails.selectedCompanyIds = this.targetCompanyList.map(function (a) {
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
      this.isObservationCategoryActive = true;
    } else {
      this.isObservationCategoryActive = false;
    }
  }
  //#endregion

  //#region - Save Observation Catgeory
  /**
       * Method for save observation category details.
       * @param isUpdatedobservationCategory - Use for new entry or update entry.
       */
  CheckIsObservationCategoryActive(isUpdatedobservationCategory) {
    this.observationCategoryDetails.isUpdatedObservationCategory = isUpdatedobservationCategory;
    if (isUpdatedobservationCategory === 0) {
      this.observationCategoryDetails.observationCategoryId = 0;
      this.observationCategoryDetails.InActive = false;
    }
    if (this.isObservationCategoryActive) {
      this.alertType = ConstantsService.Confirm;
      this.confirmMessage = MasterscreenConstantsService.Message.SelectConfirmationForActiveObsCat;
    } else {
      this.saveObservationCategoryDetails();
    }
  }

  saveObservationCategoryDetails() {
    if (this.observationCategoryDetails.selectedCompanyIds.length === 0) {
      this.validationforPickList = true;
    } else {
      this.baseService.showRootLoader = true;
      this.validationforPickList = false;
      const apiRequest = {
        Model: this.observationCategoryDetails
      };
      this.masterscreenService.saveObservationCategoryDetails(apiRequest, this.callbackMethodForSaveObservationCategoryDetails.bind(this));
    }
  }

  /**
* Callback method of Save Observation Category Details.
* @param response - response of request.
*/
  callbackMethodForSaveObservationCategoryDetails(response) {
    this.baseService.showRootLoader = false;
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = this.observationCategoryDetails.isUpdatedObservationCategory
        ? MasterscreenConstantsService.Message.UpdateObservationCategory
        : MasterscreenConstantsService.Message.SuccessObservationCategory;
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
  }

  //#endregion

  //#region - Section for Pick List
  onMoveToTargetDetails(event) {
    this.observationCategoryDetails.selectedCompanyIds = this.targetCompanyList.map(function (a) {
      return a.companyId;
    });
    // set validation if selectedCompanyIds is empty
    if (this.observationCategoryDetails.selectedCompanyIds.length === 0) {
      this.validationforPickList = true;
    } else {
      this.validationforPickList = false;
    }
  }

  onMoveToSourceDetails(event) {
    this.observationCategoryDetails.selectedCompanyIds = this.targetCompanyList.map(function (a) {
      return a.companyId;
    });
    // check for validation if targetist is empty
    if (this.observationCategoryDetails.selectedCompanyIds.length === 0) {
      this.validationforPickList = true;
    }
  }
  //#endregion - Section for Pick List

  //#region - Reset and Set Value into Grid
  resetValue() {
    this.observationCategoryDetails = new ObservationCategoryModel();
    this.targetCompanyList = [];
    this.isObservationCategoryEdit = true;
    this.ngOnInit();
    this.ngOnChanges();
    this.alertType = null;
    this.errorDetails = null;
    this.successDetails = null;
    this.confirmMessage = null;
  }
  //#endregion

  //#region - onInit event- get the details of observation Categpry
  ngOnInit() {
    // Get all observation category data and show into page grid
    const apirequest = {
      Model: {
        getOnlyActiveObsCategory: false
      }
    };
    this.masterscreenService.getObservationCategoryDetails(apirequest, this.callbackMethodForGetObservationCategoryDetails.bind(this));
  }

  /**
 * Callback method of observation category details.
 * @param response - response of request.
 */
  callbackMethodForGetObservationCategoryDetails(response) {
    if (response && response.Success) {
      this.observationCategoryDetailsResponse = response.Result;
      this.observationCategoryDetailsResponse.forEach((item) => {
        if (item.InActive === true) {
          item.InActive = 'InActive';
        } else {
          item.InActive = 'Active';
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
      if (item.InActive === 'Active') {
        this.sourceCompanyList.push({
          'companyName': item.CompanyName,
          'companyId': item.CompanyId
        });
      }
    });
  }
  //#endregion
}
