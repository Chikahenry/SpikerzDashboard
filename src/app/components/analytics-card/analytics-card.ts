import { Component, HostListener, signal, effect, computed  } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WorkflowNode {
  id: string;
  type: 'start' | 'server' | 'endpoint';
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  critical?: boolean;
  criticalCount?: number;
  details?: {
    title: string;
    items: Array<{ label: string; value: string; highlight?: boolean }>;
  };
}

interface RiskAsset {
  name: string;
  ip: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface Connection {
  from: string;
  to: string;
}

@Component({
  selector: 'app-analytics-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div class="p-6 flex-1 overflow-auto custom-scrollbar">
        <!-- Workflow Section -->
        <h3 class="text-emerald-600 font-semibold text-xl mb-6">Lorem Lorem Lorem</h3>
        
        <div class="relative bg-gray-50 rounded-lg p-8 mb-8 min-h-[300px]">
          <!-- SVG for connections -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              style="z-index: 1;">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#cbd5e0" />
              </marker>
            </defs>
            <g *ngFor="let conn of connections()">
              <path 
                [attr.d]="getConnectionPath(conn)"
                stroke="#cbd5e0" 
                stroke-width="0.5" 
                fill="none"
                marker-end="url(#arrowhead)"
                vector-effect="non-scaling-stroke" />
            </g>
          </svg>

          <!-- Workflow Nodes -->
            <div *ngFor="let node of workflowNodes()" 
              [style.position]="'absolute'"
              [style.left.%]="node.x"
              [style.top.%]="node.y"
              [style.z-index]="2"
              class="transform -translate-x-1/2 -translate-y-1/2">

              <div class="relative w-16 h-16 rounded-full cursor-pointer transition-transform hover:scale-110"
                [class]="node.type === 'start' ? 'bg-[rgba(244, 172, 172, 1)]' : 'bg-[]'"
                 (mouseenter)="selectNode(node)" (mouseleave)="closePopover()">
              <!-- Critical Badge -->
              <div *ngIf="node.critical" 
                   class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 shadow-lg">
                <img src="red-icon.png" />
              </div>
              
              <!-- Node Icon -->
              <div >
                <img  [src]="node.type == 'start' ? 'start-icon.png' : ''"/>
                <img  [src]="node.type != 'start' ? 'Icon.png' : ''"/>
                
              </div>
              
              <!-- Node Label -->
              <div class="text-start mt-2 min-w-[100px]">
                <div class="text-xs font-medium text-gray-700">{{ node.label }}</div>
                <div *ngIf="node.sublabel" class="text-xs text-gray-500">{{ node.sublabel }}</div>
              </div>
            </div>
          </div>

          <!-- Popover -->
          <div *ngIf="selectedNode()" [class]="selectedNode()?.type == 'endpoint' ? 'max-w-[300px]' : 'min-w-[350px]' "
               class="absolute bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 z-50 "
               [style.left.px]="popoverPosition().x"
               [style.top.px]="popoverPosition().y">
            <div *ngIf="selectedNode()?.type == 'start'">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div>
                    <div class="font-semibold text-red-700 bg-red-100 px-1 rounded-lg pr-10">{{ selectedNode()?.details?.title }}</div>
                  </div>
                </div>
                
              </div>
              
              <div *ngIf="selectedNode()?.details" class="space-y-2  pt-1">
                <div *ngFor="let item of selectedNode()?.details?.items " class=" items-center gap-2">
                  
                  <div class="text-red-500 p-1 rounded-lg font-medium ml-12">
                    <span class="bg-red-100 p-1 rounded-lg mr-2 pr-8">{{ item.value }}</span>
                    <span class="bg-red-100 p-1 rounded-lg mr-2 pr-8">{{ item.value }}</span>
                    <span class="bg-red-100 p-1 rounded-lg pr-8">{{ item.value }}</span>
                  </div>
                  <br>
                  <div class="text-red-500 p-1 -top-5 relative rounded-lg font-medium ml-12">
                    <span class="bg-red-100 p-1 rounded-lg mr-2 pr-8">{{ item.value }}</span>
                    <span class="bg-red-100 p-1 rounded-lg mr-2 pr-8">{{ item.value }}</span>
                    <span class="bg-red-100 p-1 rounded-lg pr-8">{{ item.value }}</span>
                  </div>
                </div>
              </div>
                <div class="text-purple-500 bg-purple-100 w-40 p-1 rounded-lg font-medium">
                  <span class="p-1 rounded-lg ">Lorem: </span>
                  <span class=" p-1 rounded-lg">1.2.3.4</span>
                </div>
            </div> 
            <div *ngIf="selectedNode()?.type == 'server'">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <img  [src]="selectedNode()?.type != 'start' ? 'Icon.png' : ''"/>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-700">{{ selectedNode()?.label }}</div>
                    <div class="text-xs text-gray-500">{{ selectedNode()?.sublabel }}</div>
                  </div>
                </div>
                
              </div>
              
              <div *ngIf="selectedNode()?.details" class="space-y-2  pt-3">
                <div *ngFor="let item of selectedNode()?.details?.items" class="flex items-center gap-2">
                  <svg *ngIf="item.highlight" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                    <span *ngIf="!item.highlight" class="text-purple-500 bg-purple-100 p-1 rounded-lg">{{ item.value }}</span>
                  <span class="text-black-800 font-semibold">{{ item.label }}</span>
                  <span class="text-purple-500 p-1 rounded-lg font-medium">
                    <span class="bg-purple-100 p-1 rounded-lg mr-2">{{ item.value }}</span>
                    <span class="bg-purple-100 p-1 rounded-lg">{{ item.value }}</span>
                  </span>
                </div>
              </div>
            </div> 
            
            <div *ngIf="selectedNode()?.type == 'endpoint'">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <img  [src]="selectedNode()?.type != 'start' ? 'Icon.png' : ''"/>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-700 text-sm">{{ selectedNode()?.label }}</div>
                    <div class="text-xs text-gray-500">{{ selectedNode()?.sublabel }}</div>
                  </div>
                </div>
                
              </div>
              
              <div *ngIf="selectedNode()?.details" class="space-y-2  pt-3">
                <div *ngFor="let item of selectedNode()?.details?.items" class="flex items-center gap-2">
                  <svg *ngIf="item.highlight" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-black-800 font-semibold">{{ item.label }}:</span>
                  <span [class]="item.highlight ? 'text-orange-500 bg-orange-100' : 'text-blue-500 bg-blue-100'" class=" p-1 rounded-lg font-medium">
                    {{ item.value }}
                  </span>
                </div>
              </div>
            </div> 
          </div>
        </div>

        <!-- Status Indicators -->
        <div class="flex items-center gap-6 mb-8">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <img src="red-icon.png" />
            </div>
            <span class="text-sm text-gray-600">Lorem</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <img src="orange-icon.png" />
            </div>
            <span class="text-sm text-gray-600">Lorem</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <img src="green-icon.png" />
            </div>
            <span class="text-sm text-gray-600">Lorem</span>
          </div>
        </div>

        <!-- Risk Assessment Section -->
        <h3 class="text-emerald-600 font-semibold text-xl mb-6">Lorem Ipsum Dolor Sit</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Assets Table -->
          <div class="bg-gray-50 rounded-lg p-4">
            <!-- Header -->
            <div class="grid grid-cols-2 gap-4 mb-3 text-sm font-medium text-gray-600">
              <div>Asset</div>
              <div>Contextual Risk</div>
            </div>
            
            <!-- Assets List -->
            <div *ngFor="let asset of paginatedAssets()" 
                class="grid grid-cols-2 gap-4 py-3 border-t border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium text-gray-700 truncate">{{ asset.name }}</div>
                  <div class="text-xs text-gray-500">{{ asset.ip }}</div>
                </div>
              </div>
              <div class="flex items-center">
                <span [class]="'inline-block px-3 py-1 rounded text-xs font-medium ' + getRiskBadgeClass(asset.risk)">
                  {{ asset.risk }}
                </span>
              </div>
            </div>

            <!-- Pagination Controls -->
            <div class="flex items-center justify-between mt-4">
              <!-- Page Size Selector (Optional) -->
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <span>Show:</span>
                <select 
                  (change)="changePageSize($any($event.target).value)"
                  class="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option value="3" selected>3</option>
                  <option value="5">5</option>
                </select>
                <span>per page</span>
              </div>

              <!-- Pagination Navigation -->
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <button 
                  (click)="previousPage()"
                  [disabled]="currentPage() === 1"
                  [class]="currentPage() === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:text-gray-700 text-gray-500'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span class="text-sm">{{ displayRange() }}</span>
                
                <button 
                  (click)="nextPage()"
                  [disabled]="currentPage() === totalPages()"
                  [class]="currentPage() === totalPages() ? 'text-gray-300 cursor-not-allowed' : 'hover:text-gray-700 text-gray-500'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Page Numbers (Optional) -->
            <div class="flex justify-center items-center gap-1 mt-3">
              <button 
                *ngFor="let page of [].constructor(totalPages()); let i = index"
                (click)="goToPage(i + 1)"
                [class]="currentPage() === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'"
                class="w-8 h-8 rounded text-sm font-medium flex items-center justify-center">
                {{ i + 1 }}
              </button>
            </div>
          </div>

          <!-- Risk Chart -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-gray-700 font-semibold mb-6">Contextual Risk</h4>
            
            <div class="flex justify-start">
              <div class="space-y-3 flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">2 Critical</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">0 High</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">0 Medium</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">0 Low</span>
                </div>
              </div>
              
              <div class="relative w-40 h-36 ml-20 -top-2">
                <svg class="transform -rotate-90" viewBox="0 5 120 110">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" stroke-width="12"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" stroke-width="8"
                          stroke-dasharray="314" stroke-dashoffset="0"
                          class="transition-all duration-500"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-3xl font-bold text-gray-700">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #a0aec0;
    }
  `]
})
export class AnalyticsCardComponent {
  selectedNode = signal<WorkflowNode | null>(null);
  popoverPosition = signal({ x: 0, y: 0 });

  workflowNodes = signal<WorkflowNode[]>([
    {
      id: 'start',
      type: 'start',
      label: 'Loremipsumm',
      x: 10,
      y: 50,
       details: {
        title: 'Lorem Ipsumm Dolor Sit',
        items: [
          { label: 'Lorem', value: '1.2.3.4' }
        ]
      }
    },
    {
      id: 'server1',
      type: 'server',
      label: 'Loremipsu',
      x: 30,
      y: 50,
       details: {
        title: 'Loremipsu',
        items: [
          { label: 'Lorem: Loremipsumm Loremipsumm', value: '1.2.3.4', highlight: true },
          { label: 'Loremipsumm ', value: '1.2.3.4' }
        ]
      }
    },
    {
      id: 'server2',
      type: 'server',
      label: 'Loremipsu',
      x: 55,
      y: 50,
       details: {
        title: 'Loremipsu',
        items: [
          { label: 'Lorem: Loremipsumm Loremipsumm', value: '1.2.3.4', highlight: true },
          { label: 'Loremipsumm ', value: '1.2.3.4' }
        ]
      }
    },
    {
      id: 'endpoint1',
      type: 'endpoint',
      label: 'Loremipsumdolorsit',
      sublabel: '192.168.1.1',
      x: 85,
      y: 30,
      critical: true,
      details: {
        title: 'Loremipsumdolorsit',
        items: [
          { label: 'Lorem', value: 'Lorem "Ipsum"', highlight: true },
          { label: 'Loremipsum', value: 'Lorem 1234,5678' },
        ]
      }
    },
    {
      id: 'endpoint2',
      type: 'endpoint',
      label: 'Loremipsumdolorsit002',
      sublabel: '192.168.1.2',
      x: 85,
      y: 70,
      critical: true,
      details: {
        title: 'Loremipsumdolorsit002',
        items: [
           { label: 'Lorem', value: 'Lorem "Ipsum"', highlight: true },
          { label: 'Loremipsum', value: 'Lorem 1234,5678' },
        ]
      }
    }
  ]);

  connections = signal<Connection[]>([
    { from: 'start', to: 'server1' },
    { from: 'server1', to: 'server2' },
    { from: 'server2', to: 'endpoint1' },
    { from: 'server2', to: 'endpoint2' }
  ]);

 riskAssets = signal<RiskAsset[]>([
    { name: 'Web Server Production', ip: '192.168.1.1', risk: 'Critical' },
    { name: 'Database Primary', ip: '192.168.1.2', risk: 'Critical' },
    { name: 'Application Server', ip: '192.168.1.3', risk: 'High' },
    { name: 'File Storage Server', ip: '192.168.1.4', risk: 'High' },
    { name: 'Backup Server', ip: '192.168.1.5', risk: 'Medium' },
    { name: 'Development Server', ip: '192.168.1.6', risk: 'Medium' },
    { name: 'Testing Environment', ip: '192.168.1.7', risk: 'Low' },
    { name: 'Monitoring Server', ip: '192.168.1.8', risk: 'Low' },
    { name: 'DNS Server', ip: '192.168.1.9', risk: 'Critical' }
  ]);

  currentPage = signal(1);
  pageSize = signal(3); 

  totalPages = computed(() => 
    Math.ceil(this.riskAssets().length / this.pageSize())
  );

  paginatedAssets = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.riskAssets().slice(startIndex, endIndex);
  });

  displayRange = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), this.riskAssets().length);
    return `Showing ${start}-${end} of ${this.riskAssets().length}`;
  });

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Risk badge styling
  getRiskBadgeClass(risk: string): string {
    switch (risk) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); 
  }

  getConnectionPath(conn: Connection): string {
    const fromNode = this.workflowNodes().find(n => n.id === conn.from);
    const toNode = this.workflowNodes().find(n => n.id === conn.to);
    
    if (!fromNode || !toNode) return '';

    // const startX = fromNode.x + 30;
    // const startY = fromNode.y;
    // const endX = toNode.x - 30;
    // const endY = toNode.y;

    const startX = fromNode.x;
    const startY = fromNode.y;
    const endX = toNode.x;
    const endY = toNode.y;
    
    const midX = (startX + endX) / 2;
    
    return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  }

  selectNode(node: WorkflowNode) {
    this.selectedNode.set(node);
    
    const containerWidth = document.querySelector('.relative.bg-gray-50')?.clientWidth || 1000;
    const containerHeight = document.querySelector('.relative.bg-gray-50')?.clientHeight || 300;
    
    const popoverX = node.type == 'endpoint' 
      ? (node.x / 100) * containerWidth - 400 
      : (node.x / 100) * containerWidth + 100;
    const popoverY = node.type == 'endpoint' 
      ? (node.y / 100) * containerHeight - 100 
      : (node.y / 100) * containerHeight - 70;
    
    this.popoverPosition.set({ x: popoverX, y: popoverY });
  }
  
  closePopover() {
    this.selectedNode.set(null);
  }

  @HostListener('window:resize')
    onResize() {
    if (this.selectedNode()) {
      this.selectNode(this.selectedNode()!);
    }
  }
}