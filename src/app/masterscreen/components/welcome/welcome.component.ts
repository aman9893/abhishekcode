import { Component, OnInit } from '@angular/core';

import { MasterscreenService } from '../../services/masterscreen.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isConfigurationComplete: boolean;
  isAppAdminLoggedIn = false;
  constructor(public masterscreenService: MasterscreenService,
    public baseService: BaseService) { }

  //#region - onInit event- get the status of configuration wizard
  ngOnInit() {
      this.baseService.showRootLoader = true;
    // Check User Details
    this.masterscreenService.checkAppAdminDetails();
    // Get the details of configuration wizard status
    this.masterscreenService.getIsObservationConfigurationCompleted(null, this.callbackMethodToGetStatusOfConfigurationWizard.bind(this));
  }

  /**
  * Callback method of configuration wizard status.
  * @param response - response of request.
  */
  callbackMethodToGetStatusOfConfigurationWizard(response) {
    if (response && response.Success) {
      // Set status of configuration wizard
      this.isConfigurationComplete = response.Result;
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.baseService.showRootLoader = false;
  }
  //#endregion

}
