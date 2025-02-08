import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { RequisicaoSituacaoModel, RetornoSituacaoModel } from '../models/situacao.model';

@Injectable({
  providedIn: 'root'
})
export class SituacaoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterSituacao(dado: RequisicaoSituacaoModel): Observable<RetornoSituacaoModel> {
    return this._http.post<RetornoSituacaoModel>(`${this.apiUrl}/listarsituacoes`, dado);
  }

  public atualizarSituacao(dado: RequisicaoSituacaoModel): Observable<RetornoSituacaoModel> {
    return this._http.post<RetornoSituacaoModel>(`${this.apiUrl}/atualizasituacao`, dado);
  }
}
