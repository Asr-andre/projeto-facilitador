import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  NgbDatepickerModule,
  NgbModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { CdkStepperModule } from "@angular/cdk/stepper";
import { NgStepperModule } from "angular-ng-stepper";

import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { NgSelectModule } from "@ng-select/ng-select";
import { UiSwitchModule } from "ngx-ui-switch";
import { ColorPickerModule } from "ngx-color-picker";
import { DropzoneModule } from "ngx-dropzone-wrapper";

import { UiModule } from "../../shared/ui/ui.module";
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
import { LogsComponent } from "../relatorios/logs/logs.component";
import { IndiceComponent } from "./indice/indice.component";
import { MascaraCpfDirective } from "src/app/core/directive/mascara-cpf.directive";

@NgModule({
  declarations: [
    MascaraCpfDirective,
    EmpresaComponent,
    ContratantesComponent,
    UsuariosComponent,
    TitulosComponent,
    SmsWhatsappComponent,
    EmailContaComponent,
    FormulaComponent,
    SmsComponent,
    ClienteComponent,
    LogsComponent,
    IndiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadastroRoutingModule,
    UiModule,
    CKEditorModule,
    CdkStepperModule,
    NgStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    UiSwitchModule,
    ColorPickerModule,
    NgbDatepickerModule,
    NgbModule,
    DropzoneModule,
    EmpresaModule,
    NgxPaginationModule,
    OrderTableModule,
    TitulosModule,
    NgbTooltipModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastroModule {}
