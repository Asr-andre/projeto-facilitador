import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule, DatePipe, registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { NgxPaginationModule } from "ngx-pagination";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { OrderTableModule } from "../core/helpers/conf-tabela/order-table.module";
import localePt from '@angular/common/locales/pt';
import { FilaComponent } from "./fila/fila.component";
import { CarteiraDeClientesComponent } from "./carteira-de-clientes/carteira-de-clientes.component";
import { ChatComponent } from "./chat/chat.component";
import { QuillModule } from 'ngx-quill';
import { DashboardModule } from "./dashboard/dashboard.module";
import { CadastroModule } from "./cadastro/cadastro.module";
import { ProcessamentosModule } from "./processamentos/processamentos.module";
import { RelatoriosModule } from "./relatorios/relatorios.module";

registerLocaleData(localePt);
@NgModule({
  declarations: [
    FilaComponent,
    CarteiraDeClientesComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    DashboardModule,
    CadastroModule,
    ProcessamentosModule,
    RelatoriosModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
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
export class PagesModule {}
