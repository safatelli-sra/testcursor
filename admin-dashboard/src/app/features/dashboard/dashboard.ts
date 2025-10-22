import { Component, computed, signal, inject } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LucideAngularModule, LUCIDE_ICONS } from 'lucide-angular';
import { icons } from 'lucide-angular';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from './mock-data.service';
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
  imports: [CommonModule, FormsModule, NgApexchartsModule, LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, useValue: icons }
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private dataSvc = inject(MockDataService);
  // Filters
  agents = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
  stores = ['Store A', 'Store B', 'Store C', 'Store D'];
  selectedAgent: string | 'all' = 'all';
  selectedStore: string | 'all' = 'all';
  dateFrom: string = '2025-01-01';
  dateTo: string = '2025-01-31';

  // Mock data (would come from service)
  scansOverTime = [12, 18, 25, 19, 30, 28, 34];
  priceEvolution = [100, 102, 101, 99, 98, 100, 103];
  visitsPerStore = [10, 7, 14, 4];
  avgVisitDuration = [18, 22, 16, 25];
  priceDiffAvg = -3.4; // % difference vs competitor
  promoPercent = 22; // % products on promo
  topExpensive = [
    { name: 'Item X', diff: '+12%' },
    { name: 'Item Y', diff: '+9%' },
    { name: 'Item Z', diff: '+7%' },
  ];
  topCheap = [
    { name: 'Item A', diff: '-11%' },
    { name: 'Item B', diff: '-9%' },
    { name: 'Item C', diff: '-6%' },
  ];
  dataQuality = { errorRate: 1.8, missingCount: 42 };
  ranking = [
    { agent: 'Alice', score: 95 },
    { agent: 'Bob', score: 88 },
    { agent: 'Charlie', score: 84 },
    { agent: 'Diana', score: 79 },
    { agent: 'Ethan', score: 75 },
  ];

  // KPIs derived
  totalScans = computed(() => this.scansOverTime.reduce((a, b) => a + b, 0));
  avgTimePerArticle =  Math.round((60 / 25) * 100) / 100; // mock 2.4s
  completionRate = 86; // % mock

  // Area chart
  areaSeries: ApexAxisChartSeries = [
    { name: 'Scans', data: this.scansOverTime },
    { name: 'Price Index', data: this.priceEvolution }
  ];
  areaChart: ApexChart = { type: 'area', height: 280, toolbar: { show: false } };
  areaDataLabels: ApexDataLabels = { enabled: false };
  areaStroke: ApexStroke = { curve: 'smooth' };
  areaXaxis: ApexXAxis = { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] };
  areaColors: string[] = ['#60a5fa', '#f59e0b'];
  areaFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } };
  areaGrid: ApexGrid = { borderColor: 'rgba(255,255,255,0.06)' };
  areaTheme: ApexTheme = { mode: 'dark' };

  // Bar chart
  barSeries: ApexAxisChartSeries = [
    { name: 'Visits per store', data: this.visitsPerStore }
  ];
  barChart: ApexChart = { type: 'bar', height: 280, toolbar: { show: false } };
  barXaxis: ApexXAxis = { categories: this.stores };
  barPlotOptions: ApexPlotOptions = { bar: { borderRadius: 6 } };
  barColors: string[] = ['#22c55e'];
  barGrid: ApexGrid = { borderColor: 'rgba(255,255,255,0.06)' };
  barTheme: ApexTheme = { mode: 'dark' };

  // Radial chart
  radialSeries: ApexNonAxisChartSeries = [this.completionRate];
  radialChart: ApexChart = { type: 'radialBar', height: 280 };
  radialLabels: string[] = ['Completion'];
  radialColors: string[] = ['#f59e0b'];
  radialTheme: ApexTheme = { mode: 'dark' };

  // Pie/Donut chart for promo share
  pieSeries: ApexNonAxisChartSeries = [this.promoPercent, 100 - this.promoPercent];
  pieChart: ApexChart = { type: 'donut', height: 280 };
  pieLabels: string[] = ['Promo', 'Regular'];

  // Additional bar for average visit duration
  durationSeries: ApexAxisChartSeries = [
    { name: 'Avg Visit Duration (min)', data: this.avgVisitDuration }
  ];
  durationChart: ApexChart = { type: 'bar', height: 280, toolbar: { show: false } };
  durationXaxis: ApexXAxis = { categories: this.stores };
  durationPlotOptions: ApexPlotOptions = { bar: { borderRadius: 6 } };
  durationColors: string[] = ['#60a5fa'];
  durationGrid: ApexGrid = { borderColor: 'rgba(255,255,255,0.06)' };
  durationTheme: ApexTheme = { mode: 'dark' };

  // Leaflet map
  map?: L.Map;
  mapInitialized = false;
  storeMarkers: Array<{ name: string; lat: number; lng: number }> = [
    { name: 'Store A', lat: 48.8566, lng: 2.3522 },
    { name: 'Store B', lat: 45.7640, lng: 4.8357 },
    { name: 'Store C', lat: 43.6047, lng: 1.4442 },
  ];

  ngAfterViewInit(): void {
    const mapEl = document.getElementById('storesMap');
    if (mapEl && !this.mapInitialized) {
      this.map = L.map('storesMap').setView([48.8566, 2.3522], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      this.storeMarkers.forEach((m) => L.marker([m.lat, m.lng]).addTo(this.map!).bindPopup(m.name));
      this.mapInitialized = true;
    }
  }

  ngOnInit(): void {
    // Simulate API calls with mock service
    this.dataSvc.getFilters().subscribe(({ agents, stores }) => {
      this.agents = agents;
      this.stores = stores;
      this.barXaxis = { categories: this.stores };
      this.durationXaxis = { categories: this.stores };
    });

    this.fetchData();
  }

  onFiltersChange(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this.dataSvc.getDashboardData({
      agent: this.selectedAgent,
      store: this.selectedStore,
      from: this.dateFrom,
      to: this.dateTo,
    }).subscribe((d) => {
      this.scansOverTime = d.scansOverTime;
      this.priceEvolution = d.priceEvolution;
      this.visitsPerStore = d.visitsPerStore;
      this.avgVisitDuration = d.avgVisitDuration;
      this.priceDiffAvg = d.priceDiffAvg;
      this.promoPercent = d.promoPercent;
      this.topExpensive = d.topExpensive;
      this.topCheap = d.topCheap;
      this.dataQuality = d.dataQuality;
      this.ranking = d.ranking;
      this.storeMarkers = d.storeMarkers;

      // Update chart series after data load
      this.areaSeries = [
        { name: 'Scans', data: this.scansOverTime },
        { name: 'Price Index', data: this.priceEvolution },
      ];
      this.barSeries = [ { name: 'Visits per store', data: this.visitsPerStore } ];
      this.durationSeries = [ { name: 'Avg Visit Duration (min)', data: this.avgVisitDuration } ];
      this.pieSeries = [ this.promoPercent, 100 - this.promoPercent ];
    });
  }
}
