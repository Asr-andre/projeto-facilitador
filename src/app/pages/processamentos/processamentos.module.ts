import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
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
    NgxMaskDirective,
    NgxMaskPipe,
    NgxPaginationModule,
    NgbModule
  ],
  providers: [
    provideNgxMask()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProcessamentosModule { }
