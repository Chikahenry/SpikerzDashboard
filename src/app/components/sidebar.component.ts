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
          class="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-md">
          <svg class="w-5 h-5" [class.rotate-180]="!isExpanded()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 p-3 space-y-1">
        <div *ngFor="let item of menuItems" 
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
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>', label: 'Lorem' },
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>', label: 'Lorem' },
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>', label: 'Lorem' },
    { icon: '<svg class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>', label: 'Lorem', active: true },
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>', label: 'Lorem' },
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>', label: 'Lorem' },
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>', label: 'Lorem' }
  ];

  footerItems: MenuItem[] = [
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>', label: 'Lorem' },
    { icon: '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>', label: 'Lorem' }
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

  onToggle() {
    this.toggleSidebar.emit();
  }
}