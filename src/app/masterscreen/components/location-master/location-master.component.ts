import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';

import { DataService } from '../../../shared/services/data.service';
import { MasterscreenService } from '../../services/masterscreen.service';
import { CompanyDetails, LocationDetails } from '../../model/admin-master.model';
import { ConstantsService } from './../../../shared/services/constants.service';
import { BaseService } from '../../../shared/services/base.service';
@Component({
    selector: 'app-location-master',
    templateUrl: './location-master.component.html',
    styleUrls: ['./location-master.component.css']
})
export class LocationMasterComponent implements OnInit, OnChanges {

    locationDetails: LocationDetails = new LocationDetails();
    locationDetailsResponse: any;
    companyDetails: CompanyDetails = new CompanyDetails();
    @Input() companyDetailsResponse: any;
    status: any[];
    isLocationEdit = true;
    @Input() companyList: SelectItem[];
    locationList: SelectItem[];
    alertType: string;
    errorDetails: any;
    successDetails: string;
    confirmMessage: string;
    isCompanyActive: boolean = false;

    constructor(
        private dataService: DataService,
        private masterscreenService: MasterscreenService,
        private baseService: BaseService,
        private router: Router) {
        this.companyList = [];
        this.locationList = [];
        this.locationDetailsResponse = [];
        this.status = [
            { label: 'Active', value: false },
            { label: 'InActive', value: true },
        ];
    }


    /**
    * Edit location details
    * @param company - locationdetails request.
    * @param index - index of row
    */
    editLocationDetails(location, index) {
        this.isLocationEdit = false;
        this.locationDetails.locationName = location.LocationName;
        this.locationDetails.locationId = location.LocationId;
        this.locationDetails.companyId = location.CompanyId;
        if (location.InActive === 'Active') {
            this.locationDetails.InActive = false;
        } else {
            this.locationDetails.InActive = true;
        }
        this.companyList = [];
        this.companyList.push(
            {
                'label': location.CompanyName,
                'value': location.CompanyId
            });
    }


    /**
      * Callback method of save location details and save data into variable.
      * @param response - response of request.
      */
    callbackMethodForSaveLocationDetails(response) {
        if (response && response.Success) {
            this.alertType = ConstantsService.Success;
            this.successDetails = this.locationDetails.isNewCompany ? 'Location Details' + ' ' +
                'updated successfully' : 'Location Details submitted successfully';
            this.ngOnInit();
        } else {
            this.alertType = ConstantsService.Error;
            this.errorDetails = response.Errors;
        }
        this.baseService.showRootLoader = false;
    }


    /**
      * Function to Save Location Details request.
      * @param response - response of request.
      */
    checkIsCompanyactiveLocationDetails(isNewCompany) {
        // this.baseService.showRootLoader = true;
        this.locationDetails.isNewCompany = isNewCompany;
        // if (isNewCompany === 0) {
        //   this.locationDetails.locationStatus = 'Active';
        // }
        if (this.isCompanyActive) {
            this.alertType = 'Confirm';
            this.confirmMessage = 'If you make location inactive,' + ' ' +
                'then it will not appear in any forms for selection. Do you want to continue ?';
        } else {
            this.saveLocationDetails();
        }

    }
    /**
      * Function to Save Location Details request.
      * @param response - response of request.
      */
    saveLocationDetails() {
        this.baseService.showRootLoader = true;
        const apiRequest = {
            Model: this.locationDetails
        };
        this.masterscreenService.saveLocationDetails(apiRequest, this.callbackMethodForSaveLocationDetails.bind(this));

    }


    /**
    * Callback method of get location details and save data into variable.
    * @param response - response of request.
    */
    callbackMethodForGetLocationDetails(response) {
        this.locationDetailsResponse = response;
        this.locationDetailsResponse.forEach((item) => {
            if (item.InActive === true) {
                item.InActive = 'InActive';
            } else {
                item.InActive = 'Active';
            }
        });
    }

    // Reset field value
    resetValue() {
        this.companyDetails = new CompanyDetails();
        this.locationDetails = new LocationDetails();
        this.alertType = null;
        this.errorDetails = null;
        this.successDetails = null;
        this.confirmMessage = null;
        this.isLocationEdit = true;
        this.isCompanyActive = false;
    }

    // Funtion to set value on selection and pass to event
    onYesClickedForConfirmation() {
        // this.alertType = '';
        // this.confirmMessage = '';
        this.saveLocationDetails();
    }

    // Funtion to set value on selection and to event
    onNoClickedForConfirmation() {
        this.confirmMessage = '';
        this.alertType = '';
        this.isCompanyActive = false;

        this.locationDetails.InActive = false;
    }


    // Funtion selectStatus check the status and display confirmation pop-up
    selectStatus(status: boolean) {
        if (status === true) {
            this.isCompanyActive = true;
        } else {
            this.isCompanyActive = false;
        }
    }


    // Set CompanyList Data if its Active company
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
        // Get all location data and show into location page grid
        this.masterscreenService.getLocationDetails(null, this.callbackMethodForGetLocationDetails.bind(this));
    }
}
