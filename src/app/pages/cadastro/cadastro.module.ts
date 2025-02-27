import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { EmpresaComponent } from "./empresa/empresa.component";
import { CadastroRoutingModule } from "./cadastro-routing.module";
import { ContratantesComponent } from "./contratantes/contratantes.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { TitulosComponent } from "./titulos/titulos.component";
import { EmpresaModule } from "./empresa/empresa.module";
import { TitulosModule } from "./titulos/titulos.module";
import { NgxPaginationModule } from "ngx-pagination";
import { OrderTableModule } from "src/app/core/helpers/conf-tabela/order-table.module";
import { SmsWhatsappComponent } from "./sms-whatsapp/sms-whatsapp.component";
import { EmailContaComponent } from "./email-conta/email-conta.component";
import { FormulaComponent } from "./formula/formula.component";
import { SmsComponent } from "./sms/sms.component";
import { ClienteComponent } from "./cliente/cliente.component";
import { IndiceComponent } from "./indice/indice.component";
import { EmailPerfilComponent } from "./email-perfil/email-perfil.component";
import { QuillModule } from "ngx-quill";
import { DiretivasModule } from "src/app/core/directive/directive.module";
import { PipesModule } from "src/app/core/pipe/pipe.module";
import { ClientesModule } from "./clientes/clientes.module";
import { ContaBancariaComponent } from "./conta-bancaria/conta-bancaria.component";
import { PerfilNotificacoesComponent } from "./perfil-notificacoes/perfil-notificacoes.component";
import { EditarNComponent } from "./perfil-notificacoes/editar/editar.component";

@NgModule({
  declarations: [
    EmpresaComponent,
    ContratantesComponent,
    UsuariosComponent,
    TitulosComponent,
    SmsWhatsappComponent,
    EmailContaComponent,
    FormulaComponent,
    SmsComponent,
    ClienteComponent,
    IndiceComponent,
    EmailPerfilComponent,
    ContaBancariaComponent,
    PerfilNotificacoesComponent,
    EditarNComponent
  ],
  imports: [
    DiretivasModule,
    PipesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadastroRoutingModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbDatepickerModule,
    NgbModule,
    EmpresaModule,
    ClientesModule,
    NgxPaginationModule,
    OrderTableModule,
    TitulosModule,
    NgbTooltipModule,
    QuillModule.forRoot(),
    NgbCollapseModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastroModule {}
