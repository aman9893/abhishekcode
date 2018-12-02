import { Component, OnInit } from '@angular/core';

import { ReportService } from '../../services/report.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-observation-requests-trend',
  templateUrl: './observation-requests-trend.component.html',
  styleUrls: ['./observation-requests-trend.component.css']
})
export class ObservationRequestsTrendComponent implements OnInit {
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
    title: 'Observation requests trends',
    chartArea: { width: this.dynamicWidth, height: this.dynamicHeight },
    isStacked: true,
    vAxis: {
      title: 'Number of Observations',
      gridlines: { count: 6 }
    },
    hAxis: {
      title: 'Month'
    },
  };

  //#region - Get Details of observation requests
  /**
     * Get Observation requests details based on open and close requests
     * @param response - response of request.
     */
  getObservationRequestsTrendReportData() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        CompanyId: this.loggedInUserJSON.Company.CompanyId
      }
    };
    // get observation requests report data
    this.reportService.getObservationRequestsTrendReportData(apiRequest, this.successGetObservationRequestsTrendReportData.bind(this));
  }

  /**
     * callback method to get the details of observation requests for close and open requests
     * @param response - response of request.
     */
  successGetObservationRequestsTrendReportData(response) {
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
      let uniqueStatus = [];

      // Get all unique observation categories
      result.forEach(row => {
        uniqueStatus.push(row.Status);
      });
      uniqueStatus = Array.from(new Set(uniqueStatus));

      // push all status in array(only headers)
      uniqueStatus.forEach(status => {
        headersRow.push(status);
      });
      tempChartData.push(headersRow);

      result.forEach(row => {
        const currentMonthAndYear = row.MonthAndYear;
        const currentRow = [row.MonthAndYear];
        const isRecordAdded = tempChartData.filter(newRow => newRow[0] === currentMonthAndYear);
        if (isRecordAdded.length === 0) {
          uniqueStatus.forEach(status => {
            const tempResult = result.filter(rw => rw.Status === status && rw.MonthAndYear === currentMonthAndYear);
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
    this.getObservationRequestsTrendReportData();
  }

}
