import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss'
})
export class CadastrarNComponent {

  constructor(
    private _alert: AlertService,
    private _funcoes: FuncoesService,
    private _route: Router
  ) { }

  public voltar() {
    this._route.navigate(['../cadastro/perfil-notificacoes']);
  }
}
