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
  FocoProximoCampoDirective
];

@NgModule({
  declarations: directive,
  imports: [CommonModule],
  exports: directive
})
export class DiretivasModule {}
