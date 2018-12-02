import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import { BaseService } from '../../services/base.service';

declare var google: any;
declare var googleLoaded: any;
@Directive({
  selector: '[appGoogleChart]'
})
export class GoogleChartDirective implements OnInit {
  public _element: any;
  @Input('chartType') public chartType: string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: Object;
  constructor(public element: ElementRef,
    public baseService: BaseService) {
    this._element = this.element.nativeElement;
  }
  ngOnInit() {
    setTimeout(() => {
      this.baseService.showRootLoader = true;
      google.charts.load('current', { 'packages': ['corechart'] });
      setTimeout(() => {
        this.baseService.showRootLoader = true;
        this.drawGraph(this.chartOptions, this.chartType, this.chartData, this._element);
      }, 2000);
    }, 1000
    );
    this.baseService.showRootLoader = false;
  }
  drawGraph(chartOptions, chartType, chartData, ele) {
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      let wrapper;
      wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
        dataTable: chartData,
        options: chartOptions || {},
        containerId: ele.id
      });
      wrapper.draw();
    }
    this.baseService.showRootLoader = false;
  }
}

