import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  serverInfo?: { label: string; sublabel: string; description: string };
}

@Component({
  selector: 'app-detail-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[calc(100vh-2rem)] overflow-y-auto 
        bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <!-- Description Section -->
        <div class="mb-6">
          <h3 class="text-emerald-600 font-semibold text-lg mb-3">Description</h3>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">
            Lorem Ipsum Dolor Sit Amet Consectetur. Aenean Sodales Pellentesque Gravida Nibh Et Magna Faucibus.
            Dui Commodo Ut Metus Amet Egestas Habitant Viverra. Quisque Fusce Senectus Facilisis Non Diam Leo Nulla
            Sem Pellentesque. Sit In Vel Sed Cursus Metus Sit Fringilla Vestibulum.
          </p>
        </div>

        <!-- Extra Section -->
        <div class="mb-6">
          <h3 class="text-emerald-600 font-semibold text-lg mb-3">Extra</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Tempus a id adipiscing fames egestas tellus dis pretium tempus.
            Justo nisl nisl lorem lectus id ornare. Rhoncus in egestas in amet porttitor pellentesque ut. Amet gravida
            integer velit felis. Eu consectetur interdum auctor sed aliquam. Eu pulvinar accumsan sed id. Duis et aliquam
            eu quisque commodo lectus. Lectus ipsum velit purus viverra vulputate viverra in nunc nulla. Euismod rhoncus
            mauris urna orci gravida sagittis netus. Amet mus in vel etiam. Interdum habitant congue massa in etiam sit.
            Commodo nibh viverra lobortis augue lorem suspendisse.
          </p>
        </div>

        <!-- Data List -->
        <div class="space-y-3 mb-6">
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-gray-600">10/19/2017</span>
          </div>
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-gray-600">Ut</span>
          </div>
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-gray-600">Eros</span>
          </div>
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-emerald-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Yes
            </span>
          </div>
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-gray-600">Sit</span>
          </div>
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-gray-600">Lorem Ipsum Dolor</span>
          </div>
          <div class="flex justify-start text-sm">
            <span class="text-gray-700 mr-10 font-medium">Lorem Ipsum Dolor</span>
            <span class="text-gray-600">Lorem Ipsum Dolor</span>
          </div>
        </div>

        <!-- Accordion Title -->
        <h4 class="text-gray-700 font-semibold mb-4">Lorem Ipsum Dolor Sit</h4>

        <!-- Accordion Items -->
        <div class="space-y-3">
          <div *ngFor="let item of accordionItems()" class="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              (click)="toggleAccordion(item.id)"
              class="w-full px-4 py-3 flex items-center justify-between">
              <div class="font-medium text-gray-700 cursor-pointer"><span>{{ item.title }}</span>
               <div *ngIf="item.serverInfo" class="flex items-start  p-3 h-20 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </div>
                  <div class="flex-1 items-start min-w-0 ml-5 mr-32">
                    <div class="font-medium text-gray-700">{{ item.serverInfo.label }}</div>
                    <div class="text-xs text-gray-500">{{ item.serverInfo.sublabel }}</div>
                  </div>
                  <div class="text-sm text-gray-400 mx-1 flex items-center">
                    <div class="border-2 border-gray-200 h-14 mx-2"></div>
                    <div>{{ item.serverInfo.description }}</div>
                  </div>
                </div>
                <div
                  class="transition-all duration-300 ease-in-out overflow-hidden"
                  [style.max-height]="expandedAccordion() === item.id ? '600px' : '0'">
                  <div class="p-4 bg-white space-y-4">
                    
                    <p class="text-sm text-gray-600 leading-relaxed">{{ item.content }}</p>
                  </div>
                </div>
            
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
   .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none; 
    scrollbar-width: none;  
  }
  
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
export class DetailCardComponent {
  expandedAccordion = signal<string | null>(null);

  accordionItems = signal<AccordionItem[]>([
    {
      id: 'lorem-p',
      title: 'Lorem P',
      serverInfo: {
        label: 'Server',
        sublabel: 'Server',
        description: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
      },
      content: 'Lorem Ipsum Dolor Sit Amet Consectetur. Nunc Vitae Tortor Convallis Vitae Arcu. Magna.'
    },
    {
      id: 'lorem-s',
      title: 'Lorem S',
      serverInfo: {
        label: 'Server',
        sublabel: 'Server',
        description: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
      },
      content: 'Lorem Ipsum Dolor Sit Amet Consectetur. Quis Viverra Etiam Pellentesque Lectus Semper In Massa Purus. Auctor Aenean Aenean Senectus Massa Dignissim Vehicula Mi Erat Purus. Praesent Scelerisque Aliquet Metus Sagittis Dictum Sed Sed. Sed Venenatis Sed Urna Quam.'
    },
    {
      id: 'lorem-t',
      title: 'Lorem T',
      serverInfo: {
        label: 'Server',
        sublabel: 'Server',
        description: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
      },
      content: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
    }
  ]);

  toggleAccordion(id: string) {
    this.expandedAccordion.update(current => current === id ? null : id);
  }
}
