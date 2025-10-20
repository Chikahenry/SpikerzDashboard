import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside [class]="sidebarClasses()">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <span [class]="headerTextClasses()">Lorem</span>
        <button 
          (click)="onToggle()"
          class="w-10 h-10 -right-2 cursor-pointer flex items-center justify-center bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-md">
          <svg class="w-5 h-5" [class.rotate-180]="!isExpanded()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 p-3 space-y-1">
        <div *ngFor="let item of menuItems" (click)="setActive(item)"
              [class.active]="item.active"
             [class]="getMenuItemClasses(item)"
             class="group cursor-pointer">
          <span [innerHTML]="item.icon" class="flex-shrink-0"></span>
          <span *ngIf="isExpanded()" class="transition-opacity duration-200">
            {{ item.label }}
          </span>
        </div>
      </nav>

      <!-- Footer -->
      <div class="border-t border-gray-200">
        <div *ngFor="let item of footerItems" 
             [class]="getMenuItemClasses(item)"
             class="cursor-pointer">
          <span [innerHTML]="item.icon" class="flex-shrink-0"></span>
          <span *ngIf="isExpanded()">{{ item.label }}</span>
        </div>

        <!-- User Profile -->
        <div class="p-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-colors">
          <div class="w-10 h-10 bg-gray-400 rounded-full flex-shrink-0 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div *ngIf="isExpanded()" class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-700 truncate">Lorem</div>
            <div class="text-xs text-gray-500 truncate">Lorem</div>
          </div>
          <svg *ngIf="isExpanded()" class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class SidebarComponent {
  isExpanded = input.required<boolean>();
  toggleSidebar = output<void>();

  menuItems: MenuItem[] = [
    { icon: '<img src="menu-icon.png" />', label: 'Lorem', active: false },
    { icon: '<img src="menu-2.png" />', label: 'Lorem', active: false},
    { icon: '<img src="menu-3.png" />', label: 'Lorem', active: false},
    { icon: '<img src="menu-4.png" />', label: 'Lorem', active: false},
    { icon: '<img src="menu-4.png" />', label: 'Lorem', active: false},
    { icon: '<img src="menu-6.png" />', label: 'Lorem', active: false}

  ];

  footerItems: MenuItem[] = [
    { icon: '<img src="menu-set.png" />', label: 'Lorem' },
    { icon: '<img src="menu-7.png" />', label: 'Lorem' }
  ];

  sidebarClasses() {
    return `flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      this.isExpanded() ? 'w-64' : 'w-20'
    }`;
  }

  headerTextClasses() {
    return `font-semibold text-gray-700 text-lg transition-opacity duration-200 ${
      this.isExpanded() ? 'opacity-100' : 'opacity-0 w-0'
    }`;
  }

  getMenuItemClasses(item: MenuItem) {
    const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200';
    const activeClasses = item.active 
      ? 'bg-emerald-50 text-emerald-700' 
      : 'text-gray-600 hover:bg-gray-100';
    return `${baseClasses} ${activeClasses}`;
  }

  setActive(selectedItem: any) {
  this.menuItems.forEach(item => item.active = false);
  selectedItem.active = true;
  }
  
  onToggle() {
    this.toggleSidebar.emit();
  }
}