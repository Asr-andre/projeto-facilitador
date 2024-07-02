import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { NgStepperModule } from 'angular-ng-stepper';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClienteContratanteComponent } from './componente/cliente-contratante/cliente-contratante.component';
import { ClienteTitulosComponent } from './componente/cliente-titulos/cliente-titulos.component';

@NgModule({

  declarations: [ClienteContratanteComponent, ClienteTitulosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    NgbDatepickerModule
  ],
  providers: [
    provideNgxMask()
  ],
  exports: [ClienteContratanteComponent, ClienteTitulosComponent]
})
export class TitulosModule { }
