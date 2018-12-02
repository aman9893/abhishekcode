import { Component, OnInit } from '@angular/core';

import { ReportService } from '../../services/report.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-observation-type-trend',
  templateUrl: './observation-type-trend.component.html',
  styleUrls: ['./observation-type-trend.component.css']
})
export class ObservationTypeTrendComponent implements OnInit {
  bar_ChartData: any = [];
  loggedInUser = this.baseService.getItemFromSession('loggedInUser');
  loggedInUserJSON = JSON.parse(this.loggedInUser);
  dynamicWidth: any = '60%';
  dynamicHeight: any = '60%';

  constructor(private reportService: ReportService,
    private baseService: BaseService) {
  }
  // declare bar chart option for displaying graph
  public bar_ChartOptions = {
    title: 'Observation type trends',
    chartArea: { width: this.dynamicWidth, height: this.dynamicHeight },
    isStacked: true,
    vAxis: {
      title: 'Number of Observation type',
      gridlines: { count: 6 }
    },
    hAxis: {
      title: 'Month'
    },
  };

  //#region - Get Details of observation requests based on observation type
  /**
     * Get Observation requests details based on observation type
     * @param response - response of request.
     */
  getObservationTypeTrendReportData() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        CompanyId: this.loggedInUserJSON.Company.CompanyId
      }
    };
    // Get Details of observation requests based on observation type report data
    this.reportService.getObservationTypeTrendReportData(apiRequest, this.successGetObservationTypeTrendReportData.bind(this));
  }

  /**
     * callback method to get the details of observation requests by observation type
     * @param response - response of request.
     */
  successGetObservationTypeTrendReportData(response) {
    if (response && response.Success) {
      this.bar_ChartData = this.getBarChartDataFormedFromList(response.Result);
      if (this.bar_ChartData.length >= 6) {
        this.dynamicWidth = '80%';
        this.dynamicHeight = '80%';
      }
    } else {
      this.baseService.processApiResponseError(response);
    }
    this.baseService.showRootLoader = false;
  }

  getBarChartDataFormedFromList(result) {
    if (result) {
      const tempChartData = [];
      const headersRow = ['Month-Year'];
      let uniqueObservationtype = [];

      // Get all unique observation categories
      result.forEach(row => {
        uniqueObservationtype.push(row.ObservationTypeName);
      });
      uniqueObservationtype = Array.from(new Set(uniqueObservationtype));

      // push all status in array(only headers)
      uniqueObservationtype.forEach(observationType => {
        headersRow.push(observationType);
      });
      tempChartData.push(headersRow);

      result.forEach(row => {
        const currentMonthAndYear = row.MonthAndYear;
        const currentRow = [row.MonthAndYear];
        const isRecordAdded = tempChartData.filter(newRow => newRow[0] === currentMonthAndYear);
        if (isRecordAdded.length === 0) {
          uniqueObservationtype.forEach(observationType => {
            const tempResult = result.filter(rw => rw.ObservationTypeName === observationType && rw.MonthAndYear === currentMonthAndYear);
            if (tempResult && tempResult.length > 0) {
              currentRow.push(tempResult[0].TotalCount);
            } else {
              currentRow.push(0);
            }
          });
          tempChartData.push(currentRow);
        }
      });
      return tempChartData;
    }
  }
  //#endregion

  ngOnInit() {
    this.getObservationTypeTrendReportData();
  }
}
