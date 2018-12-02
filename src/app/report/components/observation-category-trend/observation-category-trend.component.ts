import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-observation-category-trend',
  templateUrl: './observation-category-trend.component.html',
  styleUrls: ['./observation-category-trend.component.css']
})
export class ObservationCategoryTrendComponent implements OnInit {
  public bar_ChartData = [];
  dynamicWidth: any = '60%';
  dynamicHeight: any = '60%';

  constructor(private reportService: ReportService,
    private baseService: BaseService) { }

  loggedInUser = this.baseService.getItemFromSession('loggedInUser');
  loggedInUserJSON = JSON.parse(this.loggedInUser);

  public bar_ChartOptions = {
    title: 'Observation category trends',
    chartArea: { width: this.dynamicWidth, height: this.dynamicHeight },
    isStacked: true,
    vAxis: {
      title: 'Number of observations',
      gridlines: { count: 6 }
    },
    hAxis: {
      title: 'Month'
    },
  };

  // to get observation category trend data
  getObservationCategoryTrendReportData() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
        CompanyId: this.loggedInUserJSON.Company.CompanyId
      }
    };
    // get action trend report data
    this.reportService.getObservationCategoryTrendReportData(apiRequest, this.successGetObservationCategoryTrendReportData.bind(this));
  }

  successGetObservationCategoryTrendReportData(response) {
    if (response && response.Success) {
      this.bar_ChartData = this.getBarChartDataFormedFromList(response.Result);
      if (this.bar_ChartData.length >= 6) {
        this.dynamicWidth = '80%';
        this.dynamicHeight = '80%';
      }
    } else {

    }
    this.baseService.showRootLoader = false;
  }

  getBarChartDataFormedFromList(result) {
    if (result) {
      const tempChartData = [];
      const headersRow = ['Month-Year'];
      let uniqueCategoryNames = [];

      // Get all unique observation categories
      result.forEach(row => {
        uniqueCategoryNames.push(row.ObservationCategoryName);
      });
      uniqueCategoryNames = Array.from(new Set(uniqueCategoryNames));

      // push all observation cateogires in array(only headers)
      uniqueCategoryNames.forEach(category => {
        headersRow.push(category);
      });
      tempChartData.push(headersRow);
      result.forEach(row => {
        const currentMonthAndYear = row.MonthAndYear;
        const currentRow = [row.MonthAndYear];
        const isRecordAdded = tempChartData.filter(newRow => newRow[0] === currentMonthAndYear);
        if (isRecordAdded.length === 0) {
          uniqueCategoryNames.forEach(category => {
            const tempResult = result.filter(rw => rw.ObservationCategoryName === category && rw.MonthAndYear === currentMonthAndYear);
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

  ngOnInit() {
    this.getObservationCategoryTrendReportData();
  }

}
