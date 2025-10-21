import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexGrid,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  imports: [NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  // Area chart
  areaSeries: ApexAxisChartSeries = [
    { name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'Expenses', data: [11, 32, 45, 32, 34, 52, 41] }
  ];
  areaChart: ApexChart = { type: 'area', height: 280, toolbar: { show: false } };
  areaDataLabels: ApexDataLabels = { enabled: false };
  areaStroke: ApexStroke = { curve: 'smooth' };
  areaXaxis: ApexXAxis = { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] };
  areaColors: string[] = ['#22c55e', '#ef4444'];
  areaFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } };
  areaGrid: ApexGrid = { borderColor: 'rgba(255,255,255,0.06)' };
  areaTheme: ApexTheme = { mode: 'dark' };

  // Bar chart
  barSeries: ApexAxisChartSeries = [
    { name: 'Users', data: [44, 55, 41, 67, 22, 43] }
  ];
  barChart: ApexChart = { type: 'bar', height: 280, toolbar: { show: false } };
  barXaxis: ApexXAxis = { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] };
  barPlotOptions: ApexPlotOptions = { bar: { borderRadius: 6 } };
  barColors: string[] = ['#60a5fa'];
  barGrid: ApexGrid = { borderColor: 'rgba(255,255,255,0.06)' };
  barTheme: ApexTheme = { mode: 'dark' };

  // Radial chart
  radialSeries: ApexNonAxisChartSeries = [76];
  radialChart: ApexChart = { type: 'radialBar', height: 280 };
  radialLabels: string[] = ['Goal Completion'];
  radialColors: string[] = ['#f59e0b'];
  radialTheme: ApexTheme = { mode: 'dark' };
}
