import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../config/url.base';
import { Observable } from 'rxjs';
import { CadastrarModel, Dados, EditarModel, RequisicaoNotificacao, RetornoNotificacao } from '../../models/cadastro/perfil.notificacao.model';


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

  public obterPerfilNotificacaoPorSigla(dados: EditarModel): Observable<RetornoNotificacao> {
    return this._http.post<RetornoNotificacao>(`${this.apiUrl}/listarnotificacaoperfilsigla`, dados);
  }

  public cadastrarPerfilNotificacao(dados: CadastrarModel): Observable<RetornoNotificacao> {
    return this._http.post<RetornoNotificacao>(`${this.apiUrl}/inserirnotificacaoperfil`, dados);
  }

  public editarPerfilNotificacao(dados: Dados): Observable<RetornoNotificacao> {
    return this._http.put<RetornoNotificacao>(`${this.apiUrl}/editarnotificacaoperfil`, dados);
  }
}
