import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../config/url.base';
import { Observable } from 'rxjs';
import { RequisicaoNotificacao, RetornoNotificacao } from '../../models/cadastro/perfil.notificacao.model';


@Injectable({
  providedIn: 'root'
})
export class PerfilNotificacoesService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public obterPerfilNotificacoes(dados: RequisicaoNotificacao): Observable<RetornoNotificacao> {
    return this._http.post<RetornoNotificacao>(`${this.apiUrl}/listarnotificacaoperfil`, dados);
  }
}
