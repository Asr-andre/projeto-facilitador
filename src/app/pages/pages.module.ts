import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule, DatePipe, registerLocaleData } from "@angular/common";
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
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgPipesModule } from "ngx-pipes";
import { DndModule } from "ngx-drag-drop";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NgxPaginationModule } from "ngx-pagination";
import { AcionamentoComponent } from "./dashboard/componente/acionamento/acionamento.component";
import { WhatsappComponent } from "./dashboard/componente/telefone/whatsapp/whatsapp.component";
import { TelefoneComponent } from "./dashboard/componente/telefone/telefone.component";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { EmailComponent } from "./dashboard/componente/email/email.component";
import { OrderTableModule } from "../core/helpers/conf-tabela/order-table.module";
import { EnvioEmailComponent } from "./dashboard/componente/email/envio-email/envio-email.component";
import { EnvioSmsComponent } from "./dashboard/componente/telefone/envio-sms/envio-sms.component";
import localePt from '@angular/common/locales/pt';
import { TitulosPgRetComponent } from "./dashboard/componente/titulos-pg-ret/titulos-pg-ret/titulos-pg-ret.component";
import { EnderecoComponent } from "./dashboard/componente/endereco/endereco.component";
import { AcordoComponent } from "./dashboard/componente/acordo/acordo.component";
import { FilaComponent } from "./fila/fila.component";
import { CarteiraDeClientesComponent } from "./carteira-de-clientes/carteira-de-clientes.component";
import { SolicitarCreditosComponent } from "./dashboard/componente/solicitar-creditos/solicitar-creditos.component";
import { BoletoPixComponent } from "./dashboard/componente/boleto-pix/boleto-pix.component";
import { ChatComponent } from "./chat/chat.component";
import { QuillModule } from 'ngx-quill';
import { JuridicoComponent } from "./dashboard/componente/juridico/juridico.component";
import { DetalheModule } from "./dashboard/componente/detalhe-da-divida/detalhe.da.divida.module";

registerLocaleData(localePt);
@NgModule({
  declarations: [
    DashboardComponent,
    AcionamentoComponent,
    WhatsappComponent,
    TelefoneComponent,
    EmailComponent,
    EnvioEmailComponent,
    EnvioSmsComponent,
    TitulosPgRetComponent,
    EnderecoComponent,
    AcordoComponent,
    FilaComponent,
    CarteiraDeClientesComponent,
    SolicitarCreditosComponent,
    BoletoPixComponent,
    ChatComponent,
    JuridicoComponent
  ],
  imports: [
    CommonModule,
    DetalheModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    UiModule,
    NgPipesModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    DndModule,
    WidgetModule,
    SimplebarAngularModule,
    NgxPaginationModule,
    NgxMaskDirective,
    OrderTableModule,
    NgxMaskPipe,
    NgbTimepickerModule,
    NgbDatepickerModule,
    NgbModule,
    QuillModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNgxMask(),
    DatePipe],
})
export class PagesModule {}
