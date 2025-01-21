import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcerptPipe } from './excerpt.pipe';
import { ConvertCpfPipe } from './convert.cpf.pipe';
import { ConvertDataHoraBrPipe } from './convert.data.hora.pipe';
import { ConvertDataBrPipe } from './convert.data.br.pipe';
import { MoedaBrPipe } from './moeda.br.pipe';
import { TelefoneBrPipe } from './formata.telefone.pipe';
import { FormatarCpfPipe } from './formata.cpf.pipe';
import { MascaraPipe } from './mascara.generica.pipe';
import { TituloCompostoPipe } from './convert.maiuscula.pipe';
import { DataBrPipe } from './convert.data.utc';
import { LimitarTextoPipe } from './limitar.caracteres.pipe';
import { OrdenarPorPipe } from './ordenar.colula.pipe';
import { RemoverAcentosPipe } from './remover.acentos.pipe';
import { ContemPalavraPipe } from './contem.palavra.chave.pipe';
import { MascararTextoPipe } from './mascarar.dados.sensiveis.pipe';
import { DataHoraBrasileiraPipe } from './data.hora.pipe';
import { SimNaoPipe } from './sim.nao.pipe';


const pipes = [
  ExcerptPipe,
  ConvertCpfPipe,
  ConvertDataBrPipe,
  ConvertDataHoraBrPipe,
  MoedaBrPipe,
  TelefoneBrPipe,
  FormatarCpfPipe,
  MascaraPipe,
  TituloCompostoPipe,
  LimitarTextoPipe,
  DataBrPipe,
  OrdenarPorPipe,
  RemoverAcentosPipe,
  ContemPalavraPipe,
  MascararTextoPipe,
  DataHoraBrasileiraPipe,
  SimNaoPipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: pipes,
  exports: pipes
})
export class PipesModule { }
