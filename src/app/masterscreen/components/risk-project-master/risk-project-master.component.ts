import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../shared/services/data.service';
import { MasterscreenService } from '../../services/masterscreen.service';
import { ProjectDetails } from '../../model/risk-project-model';
import { ConstantsService } from './../../../shared/services/constants.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-risk-project-master',
  templateUrl: './risk-project-master.component.html',
  styleUrls: ['./risk-project-master.component.css']
})
export class RiskProjectMasterComponent implements OnInit {
  status: any[];
  projectDetails: ProjectDetails = new ProjectDetails();
  projectMaster: ProjectDetails[];
  isProjectNameError: boolean = false;
  alertType: string;
  errorDetails: any;
  successDetails: string;
  confirmMessage: string;
  isProjectEdit: boolean = false;

  constructor(private dataService: DataService,
    private masterscreenService: MasterscreenService,
    private baseService: BaseService) { }

  ngOnInit() {
    this.projectMaster = [];
    this.status = [
      { label: 'Active', value: false },
      { label: 'InActive', value: true },
    ];
    this.GetProjectMaster();
  }

  // Navigate to welcome page
  navigateToWelcomePage() {
    this.baseService.navigateToUrl('masterscreen');
  }

    /**
   * Function to Save Company Details request.
   * @param response - response of request.
   */
  processRequest(operation) {
    switch (operation) {
      case 1:
        if (this.projectDetails.ProjectName) {
          this.isProjectNameError = false;
          if (this.projectDetails.InActive) {
            this.alertType = 'Confirm';
            this.confirmMessage = 'You are making this project inactive. Inactive projects will not appear' + ' ' +
              'anywhere for selection. Do you still want to make it inactive? (Y/N)';
          } else {
            // save
            this.SaveProjectDetails();
          }
        } else {
          this.isProjectNameError = true;
        }
      break;
      case 0:
        if (this.projectDetails.ProjectName) {
          this.SaveProjectDetails();
        } else {
          this.isProjectNameError = true;
        }
      break;
    }
  }

  onYesClickedForConfirmation() {
    this.SaveProjectDetails();
  }

    /**
   * Function to Save Project Details request.
   * @param response - response of request.
   */
  SaveProjectDetails() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: this.projectDetails
    };
    this.masterscreenService.saveProjectDetails(apiRequest, this.successSaveProjectDetails.bind(this));
  }

    /**
   * Function to Save Project Details request.
   * @param response - response of request.
   */
  successSaveProjectDetails(response) {
    if (response && response.Success) {
      this.alertType = ConstantsService.Success;
      this.successDetails = this.projectDetails.ProjectId > 0 ? 'Project Details' + ' ' +
        'updated successfully' : 'Project Details submitted successfully';
        this.projectDetails = new ProjectDetails();
        this.isProjectEdit = false;
    } else {
      this.alertType = ConstantsService.Error;
      this.errorDetails = response.Errors;
    }
    this.GetProjectMaster();
    this.baseService.showRootLoader = false;
  }

      /**
   * Function to get project master details request.
   * @param response - response of request.
   */
  GetProjectMaster() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      CompanyId: 0
    };
    this.masterscreenService.getProjectDetails(apiRequest, this.SuccessGetProjectMaster.bind(this));
  }

  SuccessGetProjectMaster(response) {
    if (response && response.Success) {
      this.projectMaster = response.Result;
    }
    this.baseService.showRootLoader = false;
  }

  editProjectDetails(index) {
    this.projectDetails = this.projectMaster[index];
    this.isProjectEdit = true;
  }

}
