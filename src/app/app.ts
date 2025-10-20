import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar.component';
import { DashboardComponent } from './components/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
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
