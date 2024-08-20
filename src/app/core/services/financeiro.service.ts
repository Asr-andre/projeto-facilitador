import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { RequisicaoTitulosLiquidados, RetornoTitulosLiquidados } from '../models/financeiro.model';

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
}
