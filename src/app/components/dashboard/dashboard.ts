import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailCardComponent } from '../detail-card/detail-card';
import { AnalyticsCardComponent } from '../analytics-card/analytics-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DetailCardComponent, AnalyticsCardComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div class="xl:col-span-1">
          <app-detail-card></app-detail-card>
        </div>
        
        <div class="xl:col-span-2">
          <app-analytics-card></app-analytics-card>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}