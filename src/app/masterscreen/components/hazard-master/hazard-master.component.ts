import { BaseService } from '../../../shared/services/base.service';
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { ConstantsService } from './../../../shared/services/constants.service';
import { FileAttachment } from './../../../shared/models/file-attachment.model';
import { HazardMaster } from '../../model/hazard-master.model';
import { MasterscreenConstantsService } from '../../services/masterscreen-constants.service';
import { MasterscreenService } from '../../services/masterscreen.service';


@Component({
    selector: 'app-hazard-master',
    templateUrl: './hazard-master.component.html',
    styleUrls: ['./hazard-master.component.css']
})
export class HazardMasterComponent implements OnInit, OnChanges {

    @Input() companyDetailsResponse: any[];
    accept: string;
    multiple: boolean;
    hazardDetails: HazardMaster = new HazardMaster();
    sourceCompanyList: any[];
    targetCompanyList: any[];
    alertType: string;
    errorDetails: any;
    successDetails: string;
    confirmMessage: string;
    hazardDetailsResponse: any;
    isHazardEdit = true;
    deleteRecord = false;
    tempFiles: FileAttachment[] = [];
    status: any[];
    validationforPickList = false;
    isHazardActive: Boolean = false;
    validateHazardFileAttachment = false;

    constructor(public masterscreenService: MasterscreenService,
        public baseService: BaseService) {
        // File format accepted and only single file allow at a time
        this.accept = '.jpg,.png,.bmp,.BMP';
        this.multiple = false;
        // Initialize PickList
        this.sourceCompanyList = [];
        this.targetCompanyList = [];
        // Initialize hazard details response
        this.hazardDetailsResponse = [];
        // Initialize status
        this.status = [
            { label: MasterscreenConstantsService.ActiveInActiveStatuses.Active , value: false },
            { label: MasterscreenConstantsService.ActiveInActiveStatuses.InActive, value: true },
        ];
        this.hazardDetails.selectedCompanyDetails = [];

    }


    // # Start for Confirmation pop-up

    /**
    * Callback method of delete hazard details.
    * @param response - response of request.
    */
    callbackMethodForDeleteHazardDetails(response) {
        if (response && response.Success) {
            this.alertType = ConstantsService.Success;
            this.successDetails = 'Hazard Details deleted successfully';
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
        if (this.isHazardActive) {
            this.savehazardDetails();
        } else {
            this.deleteRecord = true;
            this.baseService.showRootLoader = true;
            const apiRequest = {
                Model: {
                    'hazardId': this.hazardDetails.hazardId
                }
            };
            this.masterscreenService.deleteHazardDetails(apiRequest, this.callbackMethodForDeleteHazardDetails.bind(this));
        }
    }

    // Funtion to set value on selection and to event
    onNoClickedForConfirmation() {
        this.confirmMessage = '';
        this.alertType = '';
        this.isHazardActive = false;
        this.hazardDetails.InActive = false;


    }

    // #endregion for configuration pop-up

    /**
        * Delete hazard details
        * @param hazard - hazard details request.
        * @param index - index of row
        */
    deleteHazardDetails(hazard, index) {
        this.deleteRecord = true;
        this.alertType = 'Confirm';
        this.confirmMessage = 'Are you sure you want to delete this hazard? Yes / No';
        this.hazardDetails.hazardId = hazard.HazardId;
    }

    /**
    * Callback method of Save Hazard details.
    * @param response - response of request.
    */
    callbackMethodForSaveHazardDetails(response) {
        if (response && response.Success) {
            this.alertType = ConstantsService.Success;
            this.successDetails = this.hazardDetails.isUpdatedCompany ? MasterscreenConstantsService.Message.UpdateHazardDetials
                : MasterscreenConstantsService.Message.SuccessHazardDetails;
        } else {
            this.alertType = ConstantsService.Error;
            this.errorDetails = response.Errors;
        }
        this.baseService.showRootLoader = false;
    }

    /**
        * Method for save hazard details.
        * @param isUpdatedCompany - Use for new entry or update entry.
        */
    CheckIsHazardActiveSaveHazardDetails(isUpdatedCompany) {
        this.hazardDetails.isUpdatedCompany = isUpdatedCompany;
        if (isUpdatedCompany === 0) {
            this.hazardDetails.hazardId = 0;
            this.hazardDetails.InActive = false;
        }
        if (this.isHazardActive) {
            this.alertType = 'Confirm';
            this.confirmMessage = 'If you make hazard inactive,' + ' ' +
                'then it will not appear in any forms for selection. Do you want to continue ?';
        } else {
            this.savehazardDetails();
        }
    }

    savehazardDetails() {
        if (this.hazardDetails.selectedCompanyDetails.length === 0) {
            this.validationforPickList = true;
        }
        if (this.hazardDetails.files.length === 0) {
            this.validateHazardFileAttachment = true;
        }
        if (!this.validationforPickList && this.hazardDetails.files.length > 0) {
            this.baseService.showRootLoader = true;
            this.validationforPickList = false;
            this.validateHazardFileAttachment = false;
            const apiRequest = {
                Model: this.hazardDetails
            };
            this.masterscreenService.saveHazardDetails(apiRequest, this.callbackMethodForSaveHazardDetails.bind(this));
        }
    }
    // #region - Section for Pick List
    onMoveToTargetDetails(event) {
        this.hazardDetails.selectedCompanyDetails = this.targetCompanyList.map(function (a) {
            return a.companyId;
        });
        if (this.hazardDetails.selectedCompanyDetails.length === 0) {
            this.validationforPickList = true;
        } else {
            this.validationforPickList = false;
        }
    }

    onMoveToSourceDetails(event) {
        this.hazardDetails.selectedCompanyDetails = this.targetCompanyList.map(function (a) {
            return a.companyId;
        });
        if (this.hazardDetails.selectedCompanyDetails.length === 0) {
            this.validationforPickList = true;
        }
    }
    //#endregion - Section for Pick List


    // Funtion selectStatus check the status and display confirmation pop-up
    selectStatus(status: boolean) {
        if (status === true) {
            this.isHazardActive = true;
        } else {
            this.isHazardActive = false;
        }
    }

    /**
    * Edit hazard details
    * @param hazard - hazarddetails request.
    * @param index - index of row
    */
    editHazardDetails(hazard, index) {
        this.baseService.showRootLoader = true;
        this.isHazardEdit = false;
        this.validationforPickList = false;

        this.hazardDetails.hazardId = hazard.HazardId;
        this.hazardDetails.hazardName = hazard.HazardName;
        this.hazardDetails.fileURL = hazard.FileURL;
        if (hazard.InActive === MasterscreenConstantsService.ActiveInActiveStatuses.Active) {
            this.hazardDetails.InActive = false;
        } else {
            this.hazardDetails.InActive = true;
        }
        this.targetCompanyList = [];
        this.targetCompanyList.push(
            {
                'companyName': hazard.CompanyDetails.CompanyName,
                'companyId': hazard.CompanyDetails.CompanyId
            });
        // Setting data into model for API
        this.hazardDetails.selectedCompanyDetails = this.targetCompanyList.map(function (a) {
            return a.companyId;
        });
        this.ngOnChanges();
        // Get SourceList Data based on company Id
        this.sourceCompanyList = this.sourceCompanyList.filter(sList =>
            sList.companyId !== this.targetCompanyList[0].companyId
        );
        // Adding Temporary File and checking - is file updated or not
        this.tempFiles = [];
        const fileName = hazard.FileURL.replace(/^.*[\\\/]/, '');
        const fileAttachment: FileAttachment = new FileAttachment();
        fileAttachment.name = fileName;
        fileAttachment.type = fileName.split('.').pop();
        fileAttachment.size = '71245';
        this.tempFiles.push(fileAttachment);
        this.hazardDetails.files = this.tempFiles;
        this.baseService.showRootLoader = false;
    }


    /**
   * Callback method of hazard details.
   * @param response - response of request.
   */
    callbackMethodForGetHazardDetails(response) {
        if (response && response.Success) {
            this.hazardDetailsResponse = response.Result;
            this.hazardDetailsResponse.forEach((item) => {
                if (item.InActive === true) {
                    item.InActive = MasterscreenConstantsService.ActiveInActiveStatuses.InActive;
                    item.IsShowDelete = false;
                } else {
                    item.InActive = MasterscreenConstantsService.ActiveInActiveStatuses.Active;
                    item.IsShowDelete = true;

                }
            });
        } else {
            this.baseService.processApiResponseError(response);
        }
    }

    // Reset and Set Value into Grid
    resetValue() {
        this.hazardDetails = new HazardMaster();
        this.targetCompanyList = [];
        this.isHazardEdit = true;
        this.ngOnInit();
        this.ngOnChanges();
        this.alertType = null;
        this.errorDetails = null;
        this.successDetails = null;
        this.confirmMessage = null;
        this.tempFiles = null;
    }

    ngOnInit() {
        // Get all hazard data and show into contractor page grid
        const apirequest = {
          Model: {
            'getOnlyActiveHazards': false
          }
        };
        this.masterscreenService.getHazardDetails(apirequest, this.callbackMethodForGetHazardDetails.bind(this));
    }
    // navigate to welcome page
    navigateToWelcomePage() {
        this.baseService.navigateToUrl(ConstantsService.URL.MasterScreen);
    }

    // Set sourceCompanyList Data if its Active company
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
}
