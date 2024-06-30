import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { NgStepperModule } from 'angular-ng-stepper';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

import { ContratanteComponent } from './componente/contratante/contratante.component';
import { UsuarioComponent } from './componente/usuario/usuario.component';

@NgModule({

  declarations: [ContratanteComponent, UsuarioComponent],
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
  exports: [ContratanteComponent, UsuarioComponent]
})
export class EmpresaModule { }
