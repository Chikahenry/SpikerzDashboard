import { Component, signal, effect } from '@angular/core';
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
          <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#cbd5e0" />
              </marker>
            </defs>
            <g *ngFor="let conn of connections()">
              <path 
                [attr.d]="getConnectionPath(conn)"
                stroke="#cbd5e0" 
                stroke-width="2" 
                fill="none"
                marker-end="url(#arrowhead)" />
            </g>
          </svg>

          <!-- Workflow Nodes -->
          <div *ngFor="let node of workflowNodes()" 
               [style.position]="'absolute'"
               [style.left.px]="node.x"
               [style.top.px]="node.y"
               [style.z-index]="2"
               class="transform -translate-x-1/2 -translate-y-1/2">
            
            <div class="relative cursor-pointer transition-transform hover:scale-110"
                 (click)="selectNode(node)">
              <!-- Critical Badge -->
              <div *ngIf="node.critical" 
                   class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 shadow-lg">
                {{ node.criticalCount }}
              </div>
              
              <!-- Node Icon -->
              <div [class]="getNodeClasses(node)">
                <svg *ngIf="node.type === 'start'" class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg *ngIf="node.type === 'server'" class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
                <svg *ngIf="node.type === 'endpoint'" class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              
              <!-- Node Label -->
              <div class="text-center mt-2 min-w-[100px]">
                <div class="text-xs font-medium text-gray-700">{{ node.label }}</div>
                <div *ngIf="node.sublabel" class="text-xs text-gray-500">{{ node.sublabel }}</div>
              </div>
            </div>
          </div>

          <!-- Popover -->
          <div *ngIf="selectedNode()" 
               class="absolute bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 z-50 min-w-[280px]"
               [style.left.px]="popoverPosition().x"
               [style.top.px]="popoverPosition().y">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-800">{{ selectedNode()?.label }}</div>
                  <div class="text-xs text-gray-500">{{ selectedNode()?.sublabel }}</div>
                </div>
              </div>
              <button (click)="closePopover()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div *ngIf="selectedNode()?.details" class="space-y-2 border-t pt-3">
              <div *ngFor="let item of selectedNode()?.details?.items" class="flex items-center gap-2 text-sm">
                <svg *ngIf="item.highlight" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-gray-600">{{ item.label }}:</span>
                <span [class]="item.highlight ? 'text-orange-500 font-medium' : 'text-gray-800'">
                  {{ item.value }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Indicators -->
        <div class="flex items-center gap-6 mb-8">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
            <span class="text-sm text-gray-600">Lorem</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">O</div>
            <span class="text-sm text-gray-600">Lorem</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
            <span class="text-sm text-gray-600">Lorem</span>
          </div>
        </div>

        <!-- Risk Assessment Section -->
        <h3 class="text-emerald-600 font-semibold text-xl mb-6">Lorem Ipsum Dolor Sit</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Assets Table -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 mb-3 text-sm font-medium text-gray-600">
              <div>Asset</div>
              <div>Contextual Risk</div>
            </div>
            
            <div *ngFor="let asset of riskAssets()" 
                 class="grid grid-cols-2 gap-4 py-3 border-t border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-700">{{ asset.name }}</div>
                  <div class="text-xs text-gray-500">{{ asset.ip }}</div>
                </div>
              </div>
              <div>
                <span class="inline-block px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                  {{ asset.risk }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <button class="hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span>Showing 1-2 of 2</span>
              <button class="hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Risk Chart -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-gray-700 font-semibold mb-6">Contextual Risk</h4>
            
            <div class="flex items-center justify-between">
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
              
              <div class="relative w-32 h-32">
                <svg class="transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" stroke-width="12"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" stroke-width="12"
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
      x: 80,
      y: 150
    },
    {
      id: 'server1',
      type: 'server',
      label: 'Loremipsu',
      x: 240,
      y: 150
    },
    {
      id: 'server2',
      type: 'server',
      label: 'Loremipsu',
      x: 400,
      y: 150
    },
    {
      id: 'endpoint1',
      type: 'endpoint',
      label: 'Loremipsumdolorsit',
      sublabel: '192.168.1.1',
      x: 600,
      y: 80,
      critical: true,
      criticalCount: 10,
      details: {
        title: 'Loremipsumdolorsit',
        items: [
          { label: 'Lorem', value: 'Lorem "Ipsum"' },
          { label: 'Loremipsum', value: 'Lorem 1234,5678', highlight: true }
        ]
      }
    },
    {
      id: 'endpoint2',
      type: 'endpoint',
      label: 'Loremipsumdolorsit002',
      sublabel: '192.168.1.2',
      x: 600,
      y: 220,
      critical: true,
      criticalCount: 10,
      details: {
        title: 'Loremipsumdolorsit002',
        items: [
          { label: 'Lorem', value: 'Lorem "Ipsum"' },
          { label: 'Loremipsum', value: 'Loxem 1234,5678' }
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

  riskAssets = signal([
    { name: 'Loremipsumdolorsit', ip: '192.168.1.1', risk: 'Critical' },
    { name: 'Loremipsumdolorsit002', ip: '192.168.1.2', risk: 'Critical' }
  ]);

  getNodeClasses(node: WorkflowNode): string {
    const baseClasses = 'rounded-lg p-3 shadow-lg border-2 transition-all duration-200';
    
    if (node.type === 'start') {
      return `${baseClasses} bg-purple-100 border-purple-300 hover:shadow-xl`;
    }
    return `${baseClasses} bg-blue-100 border-blue-300 hover:shadow-xl`;
  }

  getConnectionPath(conn: Connection): string {
    const fromNode = this.workflowNodes().find(n => n.id === conn.from);
    const toNode = this.workflowNodes().find(n => n.id === conn.to);
    
    if (!fromNode || !toNode) return '';

    const startX = fromNode.x + 30;
    const startY = fromNode.y;
    const endX = toNode.x - 30;
    const endY = toNode.y;
    
    const midX = (startX + endX) / 2;
    
    return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  }

  selectNode(node: WorkflowNode) {
    this.selectedNode.set(node);
    
    // Position popover to the right of the node
    const popoverX = node.x + 120;
    const popoverY = node.y - 50;
    
    this.popoverPosition.set({ x: popoverX, y: popoverY });
  }

  closePopover() {
    this.selectedNode.set(null);
  }
}