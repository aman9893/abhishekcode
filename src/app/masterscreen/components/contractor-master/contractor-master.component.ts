import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { CompanyDetails } from '../../model/admin-master.model';

import { ContractorDetails } from '../../model/contractor-master.model';
import { MasterscreenConstantsService } from '../../services/masterscreen-constants.service';
import { MasterscreenService } from '../../services/masterscreen.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-contractor-master',
  templateUrl: './contractor-master.component.html',
  styleUrls: ['./contractor-master.component.css']
})
export class ContractorMasterComponent implements OnInit, OnChanges {

  contractorDetails: ContractorDetails = new ContractorDetails();
  conractorDetailsResponse: any;
  genderList: any[];
  isContractorEdit = true;
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  status: any[];
  companyDetails: CompanyDetails = new CompanyDetails();
  hideValidationMessage: boolean;
  @Input() companyDetailsResponse: any;
  @Input() companyList: SelectItem[];
  deleteRecord = false;
  isContractorActive: boolean = false;


  // construtor part
  constructor(public masterScreenContants: MasterscreenConstantsService,
    public masterscreenService: MasterscreenService,
    public baseService: BaseService) {
    this.companyList = [];
    this.conractorDetailsResponse = [];
    this.status = [
      { label: 'Active', value: false },
      { label: 'InActive', value: true },
    ];
    this.hideValidationMessage = true;
  }

  // # Start for Confirmation pop-up

  /**
  * Callback method of delete contractor details.
  * @param response - response of request.
  */
  callbackMethodForDeleteContractorDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = 'Contractor Details deleted successfully';
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
    if (this.isContractorActive) {
      this.saveContractorDetails();
    } else {
      this.deleteRecord = true;
      this.baseService.showRootLoader = true;
      const apiRequest = {
        Model: {
          'userId': this.contractorDetails.userId
        }
      };
      this.masterscreenService.deleteContractorDetails(apiRequest, this.callbackMethodForDeleteContractorDetails.bind(this));
    }
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    this.isContractorActive = false;
    this.contractorDetails.InActive = false;
  }

  // Funtion selectStatus check the status and display confirmation pop-up
  selectStatus(status: boolean) {
    if (status === true) {
      this.isContractorActive = true;
    } else {
      this.isContractorActive = false;

    }
  }
  // #endregion for configuration pop-up

  // Reset field value
  resetValue() {
    this.contractorDetails = new ContractorDetails();
    this.alertType = null;
    this.errorDetails = null;
    this.successDetails = null;
    this.confirmMessage = null;
    this.ngOnInit();
  }

  /**
       * Delete contractor details
       * @param contractor - contractor details request.
       * @param index - index of row
       */
  deleteContractorDetails(contractor, index) {
    this.deleteRecord = true;
    this.alertType = 'Confirm';
    this.confirmMessage = 'Do you want to delete record ? Y/N';
    this.contractorDetails.userId = contractor.UserId;
  }

  /**
       * Edit contractor details
       * @param contractor - contractor details request.
       * @param index - index of row
       */
  editContractorDetails(contractor, index) {
    this.isContractorEdit = false;
    this.contractorDetails.userId = contractor.UserId;
    this.contractorDetails.fullName = contractor.FullName;
    this.contractorDetails.gender = contractor.Gender;
    this.contractorDetails.email = contractor.Email;
    this.contractorDetails.contactNumber = contractor.ContactNumber;
    this.contractorDetails.agency = contractor.Agency;
    this.contractorDetails.designation = contractor.Designation;
    this.contractorDetails.registrationId = contractor.RegistrationId;
    this.contractorDetails.companyName = contractor.Company.CompanyName;
    this.contractorDetails.companyId = contractor.Company.CompanyId;
    if (contractor.InActive === 'Active') {
      this.contractorDetails.InActive = false;
    } else {
      this.contractorDetails.InActive = true;
    }

  }

  /**
     * Call back method for save contrator details.
     * @param response - response of request.
     */
  callbackMethodForSaveContratorDetails(response) {
    if (response && response.Success) {
      this.hideValidationMessage = false;
      this.alertType = ConstantsService.Success;
      this.successDetails = this.contractorDetails.isNewCompany ? 'Contractor Details' + ' ' +
        'updated successfully' : 'Contractor Details submitted successfully';
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
    this.baseService.showRootLoader = false;
  }

  /**
      * Method for save contrator details.
      * @param isNewCompany - Use for new entry or update entry.
      */
  CheckIsContractorActiveSaveContratorDetails(isNewCompany) {
    // this.baseService.showRootLoader = true;
    this.contractorDetails.isNewCompany = isNewCompany;
    if (isNewCompany === 0) {
      this.contractorDetails.userId = 0;
      this.contractorDetails.InActive = false;
    }

    if (this.isContractorActive) {
      this.alertType = 'Confirm';
      this.confirmMessage = ' you are making status of' + ' ' + this.contractorDetails.fullName + ' '
        + 'as inactive. s(he) will not be able to log into the system' + ' ' +
        'if till you make them active again. Do you still want to make his/ her status inactive ? Y/N';
    } else {
      this.saveContractorDetails();
    }
    // Checked only for Save data

  }

  saveContractorDetails() {
    this.baseService.showRootLoader = true;

    const apiRequest = {
      Model: this.contractorDetails
    };
    this.masterscreenService.saveContractorDetails(apiRequest, this.callbackMethodForSaveContratorDetails.bind(this));
  }
  /**
  * Callback method of get contractor details and save data.
  * @param response - response of request.
  */
  callbackMethodForGetContractorDetails(response) {
    if (response && response.Result) {
      this.conractorDetailsResponse = response.Result;
      this.conractorDetailsResponse.forEach((item) => {
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

  // display only Active company in dropdown
  ngOnChanges() {
    this.companyList = [];
    this.companyDetailsResponse.filter((item) => {
      if (item.InActive === 'Active') {
        this.companyList.push({
          'label': item.CompanyName,
          'value': item.CompanyId
        });
      }
    });
  }

  // navigate to welcome page
  navigateToWelcomePage() {
    this.baseService.navigateToUrl(ConstantsService.URL.MasterScreen);
  }

  ngOnInit() {
    // Get all contractor data and show into contractor page grid
    this.masterscreenService.getContractorDetails(null, this.callbackMethodForGetContractorDetails.bind(this));
  }

}
