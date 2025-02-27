import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickCorDirective } from './alterar.cor.directive';
import { ApenasNumerosDirective } from './apenas.numeros.directive';
import { AutoFocoDirective } from './auto.focu.directive';
import { BloquearCaracteresEspeciaisDirective } from './bloquear.caracteres.directive';
import { BloquearCopiarColarDirective } from './bloquear.copia.directive';
import { DesabilitarAoClicarDirective } from './dessabilitar.apos.clicke.directive';
import { LimiteCaracteresDirective } from './limitar.numero.directive';
import { MascaraCpfCnpjDirective } from './mascara-cpf-cnpj.directive';
import { MascaraCpfDirective } from './mascara-cpf.directive';
import { MostrarSenhaDirective } from './mostra.senha.directive';
import { PermissaoDirective } from './ocultar.elemento.permissao.directive';
import { FocoProximoCampoDirective } from './proximo.campo.directive';
import { MascaraMoedaDirective } from './mascarar.moeda.directive';
import { ConverterTextoDirective } from './convert.maiusculo.directrive';
import { FormatarDocumentoDirective } from './formatar-cpf.cnpj.directive';
import { DataMesDirective } from './data-mes.directive';
import { DeixaSomenteLeituraDirective } from './deixa.somente.leitura.diretive';
import { VerificarValorNegativoDirective } from './verifica.valor.negativo.diretive';
import { SomenteLeituraDirective } from './somente.leitura.s.n.directive';
import { LimitarCaracteresDirective } from './bloquear.td.directive';
import { TelefoneMaskDirective } from './masacara.telefone.directive';
import { ApenasNumerosXDirective } from './somente.numeros.exceto.x.directive';
import { ValidaNumeroMinimoDirective } from './valida.numero.minimo.directive';

const directive = [
  ClickCorDirective,
  ApenasNumerosDirective,
  AutoFocoDirective,
  BloquearCaracteresEspeciaisDirective,
  BloquearCopiarColarDirective,
  DesabilitarAoClicarDirective,
  LimiteCaracteresDirective,
  LimiteCaracteresDirective,
  MascaraCpfCnpjDirective,
  MascaraCpfDirective,
  MascaraMoedaDirective,
  MostrarSenhaDirective,
  PermissaoDirective,
  FocoProximoCampoDirective,
  ConverterTextoDirective,
  FormatarDocumentoDirective,
  DataMesDirective,
  DeixaSomenteLeituraDirective,
  VerificarValorNegativoDirective,
  SomenteLeituraDirective,
  LimitarCaracteresDirective,
  TelefoneMaskDirective,
  ApenasNumerosXDirective,
  ValidaNumeroMinimoDirective
];

@NgModule({
  declarations: directive,
  imports: [CommonModule],
  exports: directive
})
export class DiretivasModule {}
