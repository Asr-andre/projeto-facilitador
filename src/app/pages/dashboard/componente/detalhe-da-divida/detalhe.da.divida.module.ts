import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalSituacaoComponent } from './modal-situacao/modal-situacao.component';
import { SimuladorPadraoComponent } from './simulador-padrao/simulador-padrao.component';
import { DetalheDaDividaComponent } from './detalhe-da-divida.component';
import { NgxMaskPipe } from 'ngx-mask';
import { NgPipesModule } from 'ngx-pipes';
import { PipesModule } from 'src/app/core/pipe/pipe.module';
import { DiretivasModule } from 'src/app/core/directive/directive.module';

@NgModule({
  declarations: [
    DetalheDaDividaComponent,
    SimuladorPadraoComponent,
    ModalSituacaoComponent,

  ],
  imports: [
    CommonModule,
    PipesModule,
    DiretivasModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgxMaskPipe,
    NgbDatepickerModule,
    NgbModule,
  ],
  exports: [
    DetalheDaDividaComponent,
    SimuladorPadraoComponent,
    ModalSituacaoComponent,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalheModule { }
