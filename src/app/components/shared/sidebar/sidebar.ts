import { Component, HostListener, computed, input, output } from '@angular/core';
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
  <div *ngIf="isExpanded() && isMobile()" 
      (click)="onToggle()"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300">
  </div>
    <aside [class]="sidebarClasses()">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
        <div [class]="headerTextClasses()" class="flex gap-4 md:gap-8 items-center">
          <img [width]="isExpanded() ? '32' : '80'" 
              [class]="isExpanded() ? 'w-8 md:w-10' : 'w-20 md:w-18'" 
              src="main-menu.png"/> 
          <span *ngIf="isExpanded()" 
                class="text-gray-800 text-lg md:text-xl font-semibold truncate">
            Lorem
          </span>
        </div>
        <button 
          (click)="onToggle()" 
          [class]="!isExpanded() ? 'relative -right-8 md:-right-10' : ''"
          class="w-8 h-8 md:w-10 md:h-10 cursor-pointer flex items-center justify-center 
                bg-emerald-600 text-white rounded-full hover:bg-emerald-700 
                transition-colors shadow-md flex-shrink-0">
          <svg [class.rotate-180]="!isExpanded()" 
              class="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
        <div *ngFor="let item of menuItems" 
            (click)="setActive(item); onMobileMenuClick()"
            [class.active]="item.active"
            [class]="getMenuItemClasses(item)"
            class="group cursor-pointer">
          <span [innerHTML]="item.icon" 
                class="flex-shrink-0 w-5 h-5 md:w-6 md:h-6"></span>
          <span *ngIf="isExpanded()" 
                class="text-sm md:text-base truncate transition-opacity duration-200">
            {{ item.label }}
          </span>
        </div>
      </nav>

      <!-- Footer -->
      <div class="border-t border-gray-200 mt-auto">
        <div *ngFor="let item of footerItems" 
            (click)="onMobileMenuClick()"
            [class]="getMenuItemClasses(item)"
            class="cursor-pointer">
          <span [innerHTML]="item.icon" 
                class="flex-shrink-0 w-5 h-5 md:w-6 md:h-6"></span>
          <span *ngIf="isExpanded()" class="text-sm md:text-base truncate">
            {{ item.label }}
          </span>
        </div>

        <!-- User Profile -->
        <div class="p-3 md:p-4 flex items-center gap-2 md:gap-3 
                    hover:bg-gray-100 active:bg-gray-200 cursor-pointer 
                    transition-colors border-t border-gray-100"
            (click)="onMobileMenuClick()">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded-full 
                      flex-shrink-0 flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div *ngIf="isExpanded()" class="flex-1 min-w-0">
            <div class="text-xs md:text-sm font-medium text-gray-700 truncate">Lorem</div>
            <div class="text-xs text-gray-500 truncate">Lorem</div>
          </div>
          <svg *ngIf="isExpanded()" 
              class="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
  @HostListener('window:resize')
    onResize() {
      // Auto-collapse on mobile
      if (window.innerWidth < 768 && this.isExpanded()) {
        this.toggleSidebar.emit();
      }
  }
  onMobileMenuClick() {
    // Close sidebar on mobile after clicking menu item
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.toggleSidebar.emit();
    }
  }

  isMobile = computed(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

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
    return `flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
      ${this.isExpanded() 
        ? 'w-64 md:w-72 lg:w-80 xl:w-[calc(100vw/7)]' 
        : 'w-16 md:w-20'
      }
      fixed md:relative left-0 top-0 h-full md:h-auto z-50 md:z-auto
      ${!this.isExpanded() ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`;
  }

  headerTextClasses() {
    return `font-semibold text-gray-700 text-lg duration-200 ${
      this.isExpanded() ? 'opacity-100' : 'absolute w-10 h-10'
    }`;
  }

  getMenuItemClasses(item: MenuItem) {
    const baseClasses = 'flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200';
    const activeClasses = item.active 
      ? 'bg-emerald-50 text-emerald-700 font-medium' 
      : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200';
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