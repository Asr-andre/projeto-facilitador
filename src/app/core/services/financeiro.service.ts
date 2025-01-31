import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { RequisicaoPrestacaoContas, RequisicaoTitulosLiquidados, RetornoPrestacaoContas, RetornoTitulosLiquidados } from '../models/financeiro.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterFiltros(request: RequisicaoTitulosLiquidados): Observable<RetornoTitulosLiquidados> {
    return this._http.post<RetornoTitulosLiquidados>(`${this.apiUrl}/listarpagamentoperiodo`, request);
  }

  public impressaoPrestacaoContas(request: RequisicaoPrestacaoContas): Observable<RetornoPrestacaoContas> {
    return this._http.post<RetornoPrestacaoContas>(`${this.apiUrl}/imprimirpagamento`, request);
  }
}
