import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule, DatePipe, registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { NgxPaginationModule } from "ngx-pagination";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import localePt from '@angular/common/locales/pt';
import { DetalheModule } from "./componente/detalhe-da-divida/detalhe.da.divida.module";
import { OrderTableModule } from "src/app/core/helpers/conf-tabela/order-table.module";
import { QuillModule } from "ngx-quill";
import { DashboardComponent } from "./dashboard.component";
import { CarteiraDeClientesComponent } from "../carteira-de-clientes/carteira-de-clientes.component";
import { ChatComponent } from "../chat/chat.component";
import { FilaComponent } from "../fila/fila.component";
import { AcionamentoComponent } from "./componente/acionamento/acionamento.component";
import { AcordoComponent } from "./componente/acordo/acordo.component";
import { BoletoPixComponent } from "./componente/boleto-pix/boleto-pix.component";
import { EmailComponent } from "./componente/email/email.component";
import { EnvioEmailComponent } from "./componente/email/envio-email/envio-email.component";
import { EnderecoComponent } from "./componente/endereco/endereco.component";
import { JuridicoComponent } from "./componente/juridico/juridico.component";
import { ReciboComponent } from "./componente/recibo/recibo.component";
import { SolicitarCreditosComponent } from "./componente/solicitar-creditos/solicitar-creditos.component";
import { EnvioSmsComponent } from "./componente/telefone/envio-sms/envio-sms.component";
import { TelefoneComponent } from "./componente/telefone/telefone.component";
import { WhatsappComponent } from "./componente/telefone/whatsapp/whatsapp.component";
import { TitulosPgRetComponent } from "./componente/titulos-pg-ret/titulos-pg-ret/titulos-pg-ret.component";


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
    SolicitarCreditosComponent,
    BoletoPixComponent,
    JuridicoComponent,
    ReciboComponent
  ],
  imports: [
    CommonModule,
    DetalheModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
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
export class DashboardModule {}
