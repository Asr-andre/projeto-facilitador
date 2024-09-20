import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';
import { DropzoneModule } from 'ngx-dropzone-wrapper';

import { UiModule } from '../../shared/ui/ui.module';
import { EmpresaComponent } from './empresa/empresa.component';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { ContratantesComponent } from './contratantes/contratantes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TitulosComponent } from './titulos/titulos.component';
import { EmpresaModule } from './empresa/empresa.module';
import { TitulosModule } from './titulos/titulos.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { SmsWhatsappComponent } from './sms-whatsapp/sms-whatsapp.component';
import { EmailContaComponent } from './email-conta/email-conta.component';

@NgModule({

  declarations: [EmpresaComponent, ContratantesComponent, UsuariosComponent, TitulosComponent, SmsWhatsappComponent, EmailContaComponent],
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
    DropzoneModule,
    EmpresaModule,
    NgxPaginationModule,
    OrderTableModule,
    TitulosModule,
    NgbTooltipModule,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CadastroModule { }
