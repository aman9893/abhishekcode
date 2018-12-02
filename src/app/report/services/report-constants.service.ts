import { Injectable } from '@angular/core';

@Injectable()
export class ReportConstantsService {

  constructor() { }

  public static ApiConstants = {
    GetActionTrendReport: 'api/report/get/actionTrendReport',
    GetObservationCategoryTrendReport: 'api/report/get/observationCategoryTrendReport',
    GetObservationRequestsTrendReport: 'api/report/get/observationRequestsTrendReport',
    GetObservationTypeTrendReport: 'api/report/get/observationTypeTrendReport'
  };
}
