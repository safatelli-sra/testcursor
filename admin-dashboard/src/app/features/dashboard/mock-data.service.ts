import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface DashboardFilters {
  agents: string[];
  stores: string[];
}

export interface DashboardRequest {
  agent: string | 'all';
  store: string | 'all';
  from: string;
  to: string;
}

export interface DashboardData {
  scansOverTime: number[];
  priceEvolution: number[];
  visitsPerStore: number[];
  avgVisitDuration: number[];
  priceDiffAvg: number;
  promoPercent: number;
  topExpensive: Array<{ name: string; diff: string }>;
  topCheap: Array<{ name: string; diff: string }>;
  dataQuality: { errorRate: number; missingCount: number };
  ranking: Array<{ agent: string; score: number }>; 
  storeMarkers: Array<{ name: string; lat: number; lng: number }>;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getFilters(): Observable<DashboardFilters> {
    return of({
      agents: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'],
      stores: ['Store A', 'Store B', 'Store C', 'Store D'],
    }).pipe(delay(200));
  }

  getDashboardData(_req: DashboardRequest): Observable<DashboardData> {
    // Static mock data simulating API responses
    return of({
      scansOverTime: [12, 24, 20, 30, 28, 40, 36],
      priceEvolution: [100, 101, 99, 102, 100, 98, 101],
      visitsPerStore: [10, 7, 14, 4],
      avgVisitDuration: [18, 22, 16, 25],
      priceDiffAvg: -3.4,
      promoPercent: 22,
      topExpensive: [
        { name: 'Item X', diff: '+12%' },
        { name: 'Item Y', diff: '+9%' },
        { name: 'Item Z', diff: '+7%' }
      ],
      topCheap: [
        { name: 'Item A', diff: '-11%' },
        { name: 'Item B', diff: '-9%' },
        { name: 'Item C', diff: '-6%' }
      ],
      dataQuality: { errorRate: 1.8, missingCount: 42 },
      ranking: [
        { agent: 'Alice', score: 95 },
        { agent: 'Bob', score: 88 },
        { agent: 'Charlie', score: 84 },
        { agent: 'Diana', score: 79 },
        { agent: 'Ethan', score: 75 }
      ],
      storeMarkers: [
        { name: 'Store A', lat: 48.8566, lng: 2.3522 },
        { name: 'Store B', lat: 45.7640, lng: 4.8357 },
        { name: 'Store C', lat: 43.6047, lng: 1.4442 },
      ]
    }).pipe(delay(300));
  }
}
