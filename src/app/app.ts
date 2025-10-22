import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/shared/sidebar/sidebar';
import { DashboardComponent } from './components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardComponent],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
       <!-- Mobile Menu Button -->
      <button *ngIf="!isSidebarExpanded()" 
              (click)="toggleSidebar()"
              class="md:hidden fixed top-4 left-4 z-50 w-10 h-10 
                    bg-emerald-600 text-white rounded-full shadow-lg 
                    flex items-center justify-center hover:bg-emerald-700 
                    transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <app-sidebar
        [isExpanded]="isSidebarExpanded()"
        (toggleSidebar)="toggleSidebar()">
      </app-sidebar>
      <main class="flex-1 overflow-auto">
        <app-dashboard></app-dashboard>
      </main>
    </div>
  `
})
export class AppComponent {
  isSidebarExpanded = signal(true);

  toggleSidebar() {
    this.isSidebarExpanded.update(value => !value);
  }
}
