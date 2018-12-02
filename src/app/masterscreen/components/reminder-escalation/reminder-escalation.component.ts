import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { DataService } from '../../../shared/services/data.service';
import { MasterscreenService } from '../../services/masterscreen.service';
import { CompanyDetails, LocationDetails } from '../../model/admin-master.model';
import { Configuration } from '../../model/configuration.model';
import { ConstantsService } from './../../../shared/services/constants.service';
import { BaseService } from '../../../shared/services/base.service';
import { MasterscreenConstantsService } from '../../services/masterscreen-constants.service';

@Component({
  selector: 'app-reminder-escalation',
  templateUrl: './reminder-escalation.component.html',
  styleUrls: ['./reminder-escalation.component.css']
})
export class ReminderEscalationComponent implements OnInit, OnChanges {
  @Input() companyDetailsResponse: any;
  @Input() companyList: SelectItem[];
  reminderEscalationDetails: Configuration = new Configuration();
  reminderEscalationDetailsResponse: any;
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  isValidNoOfdaysErrorMsg: any;
  constructor(
    private masterscreenService: MasterscreenService,
    private baseService: BaseService) {
    this.companyList = [];
    this.companyDetailsResponse = [];
    this.reminderEscalationDetailsResponse = [];
  }

  // Set CompanyList Data if its Active company
  ngOnChanges() {
    this.companyList = [];
    this.companyDetailsResponse.filter((item) => {
      if (item.InActive === ConstantsService.ActiveInactiveStatus.Active) {
        this.companyList.push({
          'label': item.CompanyName,
          'value': item.CompanyId
        });
      }
    });
  }

  /**
   * Callback method of get company details and save data into variable.
   * @param response - response of request.
   */
  callbackMethodForGetCompanyDetails(response) {
    if (response && response.length > 0) {
      this.companyDetailsResponse = response;
      this.companyList = [];
      this.companyDetailsResponse.forEach((item) => {
        if (item.InActive === false) {
          this.companyList.push(
            {
              'label': item.CompanyName,
              'value': item.CompanyId
            }
          );
        }
      });

      this.companyDetailsResponse.forEach((item) => {
        if (item.InActive === true) {
          item.InActive = ConstantsService.ActiveInactiveStatus.Inactive;
        } else {
          item.InActive = ConstantsService.ActiveInactiveStatus.Active;
        }
      });
    }
  }

  numberOnly(event): boolean {
    this.isValidNoOfdaysErrorMsg = false;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  // Reset field value
  resetValue() {
    this.reminderEscalationDetails = new Configuration();
    this.reminderEscalationDetails.ConfigurationKey = MasterscreenConstantsService.EmailConstants.ConfigurationKey;
    this.alertType = '';
  }

  // Funtion to set value on selection and pass to event
  onYesClickedForConfirmation() {
    // this.alertType = '';
    // this.confirmMessage = '';
    this.saveConfigurationDetails();
  }

  // Funtion to set value on selection and to event
  onNoClickedForConfirmation() {
    this.confirmMessage = '';
    this.alertType = '';
  }

  /**
        * Function to Save configuration details request.
        * @param response - response of request.
        */
  saveConfigurationDetails() {
    this.baseService.showRootLoader = true;
 
    if (parseInt(this.reminderEscalationDetails.ConfigurationValue) > 0) {
      const apiRequest = {
        Model: this.reminderEscalationDetails
      };
      this.masterscreenService.saveConfigurationDetails(apiRequest, this.callbackMethodForSaveConfigurationDetails.bind(this));
    } else {
      this.isValidNoOfdaysErrorMsg = true;
      this.baseService.showRootLoader = false;
    }
  }

  /**
      * Callback method of save location details and save data into variable.
      * @param response - response of request.
      */
  callbackMethodForSaveConfigurationDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = MasterscreenConstantsService.Message.SubmitConfigurationSuccessfully;
      this.ngOnInit();
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
    this.baseService.showRootLoader = false;
    this.isValidNoOfdaysErrorMsg = false;
  }

  // navigate to welcome page
  navigateToWelcomePage() {
    this.baseService.navigateToUrl(ConstantsService.URL.MasterScreen);
  }

  ngOnInit() {
    this.reminderEscalationDetails.ConfigurationKey = MasterscreenConstantsService.EmailConstants.ConfigurationKey;
    this.masterscreenService.getCompanyDetails(null, this.callbackMethodForGetCompanyDetails.bind(this));
  }

}
