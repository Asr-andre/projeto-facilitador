import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenarPeloHeaderTabela } from './ordenacao-tabela';

@NgModule({
  declarations: [OrdenarPeloHeaderTabela],
  imports: [
    CommonModule
  ],
  exports:[OrdenarPeloHeaderTabela]
})
export class OrderTableModule { }
