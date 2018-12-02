import { Injectable } from '@angular/core';

import { DataService } from '../../shared/services/data.service';
import { ReportConstantsService } from '../services/report-constants.service';

@Injectable()
export class ReportService {

    constructor(private dataService: DataService) { }

    /**
       * Function to get report detalis
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
    // service call to get action trend report data
    getActionTrendReportData(model, callbackMethod) {
        this.dataService.post(ReportConstantsService.ApiConstants.GetActionTrendReport, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
       * Function to get observation category report detalis
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
    // service call to get observation category trend report data
    getObservationCategoryTrendReportData(model, callbackMethod) {
        this.dataService.post(ReportConstantsService.ApiConstants.GetObservationCategoryTrendReport, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
       * Function to get observation requests report detalis
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
    getObservationRequestsTrendReportData(model, callbackMethod) {
        this.dataService.post(ReportConstantsService.ApiConstants.GetObservationRequestsTrendReport, model)
            .subscribe(response => {
                callbackMethod(response);
            });
    }

    /**
       * Function to get observation requests detalis based on observation type
       * @param Model - Model to send data to api
       * @param callbackMethod - return the response
       */
    getObservationTypeTrendReportData(model, callbackMethod) {
        this.dataService.post(ReportConstantsService.ApiConstants.GetObservationTypeTrendReport, model)
        .subscribe(response => {
            callbackMethod(response);
        });
    }
}
