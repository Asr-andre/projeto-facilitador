import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '../shared/ui/ui.module';
import { WidgetModule } from '../shared/widget/widget.module';

import { PagesRoutingModule } from './pages-routing.module';

import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbNavModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgPipesModule } from 'ngx-pipes';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DndModule } from 'ngx-drag-drop';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { EmailModule } from './email/email.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { AcionamentoComponent } from './dashboard/componente/acionamento/acionamento.component';
import { WhatsappComponent } from './dashboard/componente/whatsapp/whatsapp.component';



@NgModule({
  declarations: [DashboardComponent, AcionamentoComponent, WhatsappComponent, CalendarComponent, ChatComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    UiModule,
    NgPipesModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgApexchartsModule,
    DndModule,
    FullCalendarModule,
    EmailModule,
    LeafletModule,
    WidgetModule,
    SimplebarAngularModule,
    NgxPaginationModule
  ],
  providers: [
  ]
})
export class PagesModule { }
