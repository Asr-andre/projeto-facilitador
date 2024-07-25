import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';

import { UiModule } from '../../shared/ui/ui.module';

import { ImportacaoRoutingModule } from './processamentos-routing.module';
import { ImportacaoComponent } from './importacao/importacao.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImportacaoManualComponent } from './importacao/componente/importacao-manual/importacao-manual.component';

@NgModule({

  declarations: [ImportacaoComponent, ImportacaoManualComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImportacaoRoutingModule,
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
    NgxPaginationModule,
    NgbModule
  ],
  providers: [
    provideNgxMask()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProcessamentosModule { }
