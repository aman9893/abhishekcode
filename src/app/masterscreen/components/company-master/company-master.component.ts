import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { DataService } from '../../../shared/services/data.service';
import { MasterscreenService } from '../../services/masterscreen.service';
import { CompanyDetails, LocationDetails } from '../../model/admin-master.model';
import { ConstantsService } from './../../../shared/services/constants.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent implements OnInit {

  companyDetails: CompanyDetails = new CompanyDetails();
  @Input() companyDetailsResponse: any;
  status: any[];
  isCompanyEdit = true;
  @Input() companyList: SelectItem[];
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  @Output() OnChangeEvent: EventEmitter<any>;
  companyValidation: boolean;
  isCompanyActive: boolean = false;

  constructor(
    private dataService: DataService,
    private masterscreenService: MasterscreenService,
    private baseService: BaseService,
    private cdRef: ChangeDetectorRef) {
    this.OnChangeEvent = new EventEmitter();
    this.status = [
      { label: 'Active', value: false },
      { label: 'InActive', value: true },
    ];
    this.companyValidation = false;
  }



  /**
  * Callback method of save company details and save data into variable.
  * @param response - response of request.
  */
  callbackMethodForSaveCompanyDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = this.companyDetails.isNewCompany ? 'Company Details' + ' ' +
        'updated successfully' : 'Company Details submitted successfully';
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
    this.baseService.showRootLoader = false;
  }

  /**
   * Function to Save Company Details request.
   * @param response - response of request.
   */
  checkIsCompanyActive(isNewCompany) {

    this.companyDetails.isNewCompany = isNewCompany;
    if (this.companyDetails.companyName) {
      if (this.isCompanyActive) {
        this.alertType = 'Confirm';
        this.confirmMessage = 'You are making this company inactive. Inactive companies will not appear' + ' ' +
          'anywhere for selection. Do you still want to make it inactive? (Y/N)';
      } else {
        this.SaveCompanyDetails();
      }
    } else {
      this.companyValidation = true;
    }
  }

  /**
   * Function to Save Company Details request.
   * @param response - response of request.
   */
  SaveCompanyDetails() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: this.companyDetails
    };
    this.masterscreenService.saveCompanyDetails(apiRequest, this.callbackMethodForSaveCompanyDetails.bind(this));
  }

  /**
       * Edit company details
       * @param company - company details request.
       * @param index - index of row
       */
  editCompanyDetails(company, index) {
    this.isCompanyEdit = false;
    this.companyDetails.companyName = company.CompanyName;
    if (company.InActive === 'Active') {
      this.companyDetails.InActive = false;
    } else {
      this.companyDetails.InActive = true;
    }
    this.companyDetails.companyId = company.CompanyId;
    // reset validation on update
    this.companyValidation = false;
  }


  // Reset field value
  resetValue() {
    this.companyDetails = new CompanyDetails();
    this.isCompanyEdit = true;
    this.alertType = null;
    this.errorDetails = null;
    this.successDetails = null;
    this.confirmMessage = null;
    this.OnChangeEvent.emit();
  }

  // Funtion to set value on selection and pass to event
  onYesClickedForConfirmation() {
    // save company details
    this.SaveCompanyDetails();
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
    this.isCompanyActive = false;
    this.companyDetails.InActive = false;
  }

  // Funtion selectStatus check the status and display confirmation pop-up
  selectStatus(status: boolean) {
    if (status === true) {
      this.isCompanyActive = true;
    } else {
      this.isCompanyActive = false;
    }
  }

  // check validation for field
  onSearchChange() {
    if (this.companyDetails.companyName) {
      this.companyValidation = false;
    } else {
      this.companyValidation = true;
    }
  }

  // Navigate to welcome page
  navigateToWelcomePage() {
    this.baseService.navigateToUrl('masterscreen');
  }
  ngOnInit() {
  }
}
