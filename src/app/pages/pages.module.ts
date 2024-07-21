import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UiModule } from "../shared/ui/ui.module";
import { WidgetModule } from "../shared/widget/widget.module";

import { PagesRoutingModule } from "./pages-routing.module";

import { SimplebarAngularModule } from "simplebar-angular";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgPipesModule } from "ngx-pipes";
import { FullCalendarModule } from "@fullcalendar/angular";
import { DndModule } from "ngx-drag-drop";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ChatComponent } from "./chat/chat.component";
import { EmailModule } from "./email/email.module";

import { NgxPaginationModule } from "ngx-pagination";
import { AcionamentoComponent } from "./dashboard/componente/acionamento/acionamento.component";
import { WhatsappComponent } from "./dashboard/componente/detalhe-da-divida/whatsapp/whatsapp.component";
import { TelefoneComponent } from "./dashboard/componente/telefone/telefone.component";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { EmailComponent } from "./dashboard/componente/email/email.component";
import { DetalheDaDividaComponent } from "./dashboard/componente/detalhe-da-divida/detalhe-da-divida.component";
import { OrderTableModule } from "../core/helpers/conf-tabela/order-table.module";
import { EnvioEmailComponent } from "./dashboard/componente/detalhe-da-divida/envio-email/envio-email.component";
import { EnvioSmsComponent } from "./dashboard/componente/detalhe-da-divida/envio-sms/envio-sms.component";

@NgModule({
  declarations: [
    DashboardComponent,
    DetalheDaDividaComponent,
    AcionamentoComponent,
    WhatsappComponent,
    TelefoneComponent,
    EmailComponent,
    CalendarComponent,
    ChatComponent,
    EnvioEmailComponent,
    EnvioSmsComponent
  ],
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
    NgxPaginationModule,
    NgxMaskDirective,
    OrderTableModule,
    NgxMaskPipe,
    NgbTimepickerModule,
    NgbDatepickerModule,
  ],
  providers: [provideNgxMask()],
})
export class PagesModule {}
