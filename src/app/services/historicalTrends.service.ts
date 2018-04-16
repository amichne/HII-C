import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Chart } from '../models/chart.model';
import { Observation } from '../models/observation.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
@Component({})
export class HistoricalTrendsService {
  // Maps the name of a chart to the chart object itself.
  chartsMap: Map<string, Chart> = new Map<string, Chart>();
  // Store all the charts currently being displayed.
  charts: Array<Chart> = [];

  dataDef: Chart;
  test: Chart;
  canvasHeight: number;
  private activateGraphSource = new Subject<boolean>();
  activateGraph$ = this.activateGraphSource.asObservable();

  constructor() { }

  buttonClicked(clicked: boolean) {
    this.activateGraphSource.next(clicked);
  }

  // Add a new chart displaying the contents of 'data' to the trends tool.
  public addChart(chartName, data) {
    // A chart already exists with the given name.
    if (this.chartsMap.has(chartName)) {
      return;
    }

    if (data == null || data.length == 0) {
      // Avoid creating an empty chart.
      return;
    }

    let chart = new Chart();

    // Get the title associated with the data point.
    chart.title = data[0].code['text'];

    for (let point of data) {
      // Skip data points without a numeric value.
      if (!point.valueQuantity || !point.valueQuantity['value']) {
        continue;
      }

      // Add the data point to the chart.
      chart.data.push({
        name: new Date(point.relativeDateTime),
        value: point.valueQuantity['value']
      });
    }

    // Sort data points in order of date of occurrence.
    chart.data = chart.data.sort((p1, p2) => p1.name - p2.name);

    // Store the data points in the format expected by NGX-Charts for line charts.
    chart.lineChartData = [{
      name: chart.title,
      series: chart.data
    }];

    // Set the min and max y-axis values for the chart, providing a small buffer
    // of extra space.
    let [max, min] = this.getMinMaxValues(chart);
    let buffer = (max - min) * 0.2;

    chart.yScaleMin = min - buffer;
    chart.yScaleMax = max + buffer;

    // Add the normal range values for the chart (displayed as horizontal "reference" lines).
    chart.normalValues = [
      {
        name: "Low",
        value: min // TODO: These shouldn't be hardcoded.
      },
      {
        name: "High",
        value: max // TODO: These shouldn't be hardcoded.
      }
    ];

    // Add the newly created chart to the list of charts.
    this.chartsMap.set(chartName, chart);
    this.charts = Array.from(this.chartsMap.values());
  }

  // Remove the chart with the given name from the trends tool.
  public removeChart(chartName) {
    // First check if a chart exists with the given name.
    if (this.chartsMap.has(chartName)) {
      this.chartsMap.delete(chartName);
      this.charts = Array.from(this.chartsMap.values());
    }
  }

  // Get the smallest and largest values from a given chart.
  private getMinMaxValues(chart: Chart) {
    // If the data provided is empty, return [0, 0].
    if (!chart.data || chart.data.length == 0) {
      return [0, 0];
    }

    let min = chart.data[0].value;
    let max = chart.data[0].value;

    for (let point of chart.data) {
      min = Math.min(min, point.value);
      max = Math.max(max, point.value);
    }

    return [min, max];
  }
}