import { Status } from './../../../actiontracker/model/status.model';
import { Response } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { BaseService } from '../../../shared/services/base.service';

@Component({
  selector: 'app-trend-report',
  templateUrl: './trend-report.component.html',
  styleUrls: ['./trend-report.component.css']
})
export class TrendReportComponent implements OnInit {
  public bar_ChartData = [];
  dynamicWidth: any = '60%';
  dynamicHeight: any = '60%';

  constructor(private reportService: ReportService,
    private baseService: BaseService) { }

  public bar_ChartOptions = {
    title: 'Action trends',
    chartArea: { width: this.dynamicWidth, height: this.dynamicHeight },
    isStacked: true,
    vAxis: {
      title : 'Number of actions',
      gridlines: { count: 6 }
    },
    hAxis: {
      title : 'Month'
    },
};

// to get observation data
  getActionTrendReportData() {
    this.baseService.showRootLoader = true;
    const apiRequest = {
      Model: {
      }
    };
    // get action trend report data
    this.reportService.getActionTrendReportData(apiRequest, this.successGetActionTrendReportData.bind(this));
  }

  successGetActionTrendReportData(response) {
    if (response && response.Success) {
      this.bar_ChartData = this.getBarChartDataFormedFromList(response.Result);
      if (this.bar_ChartData.length >= 6) {
        this.dynamicWidth = '80%';
        this.dynamicHeight = '80%';
      }
      console.log(this.bar_ChartData);
    } else {

    }
    this.baseService.showRootLoader = false;
  }

  getBarChartDataFormedFromList(result) {
    if (result) {
      const tempChartData = [
        ['Month-Year', 'Open', 'Closed']
     ];
     result.forEach(row => {
       const currentMonthAndYear = row.MonthAndYear;
       const openResult = result.filter(newRow => newRow.Status === 'Open' && newRow.MonthAndYear === currentMonthAndYear);
       const closeResult = result.filter(newRow => newRow.Status === 'Closed' && newRow.MonthAndYear === currentMonthAndYear);
       let openCount = 0;
       let closeCount = 0;
      if (openResult && openResult.length > 0) {
        openCount = openResult[0].TotalCount;
      } else {
        openCount = 0;
      }

      if (closeResult && closeResult.length > 0) {
        closeCount = closeResult[0].TotalCount;
      } else {
        closeCount = 0;
      }
      const isRecordAdded = tempChartData.filter(newRow => newRow[0] === currentMonthAndYear);
      if (isRecordAdded.length === 0) {
        tempChartData.push([row.MonthAndYear, openCount, closeCount]);
      }
    });
    return tempChartData;
    }
  }

  ngOnInit() {
    this.getActionTrendReportData();
  }

}
