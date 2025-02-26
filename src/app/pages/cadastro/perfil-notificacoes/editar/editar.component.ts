import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarNComponent implements OnInit {
  public sigla: string = '';

  constructor(
    private _alert: AlertService,
    private _funcoes: FuncoesService,
    private _route: Router,
    private _sigla: ActivatedRoute
  ) {
    this._sigla.params.subscribe(params => {
      this.sigla = params['sigla'];
    });
  }

  ngOnInit(): void {

  }

  public voltar() {
    this._route.navigate(['../cadastro/perfil-notificacoes']);
  }
}
