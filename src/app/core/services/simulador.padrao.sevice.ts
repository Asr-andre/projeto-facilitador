import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { BaixaPagamentoRequisicaoModel, BaixaPagamentoRetorno, RecalculoRequisicaoModel, RecalculoRetornoModel, SimulacaoRequisicaoModel, SimulacaoRetornoModel } from '../models/simulador.padrao.model';

@Injectable({
  providedIn: 'root'
})
export class SimuladorPadraoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public simularNegociacao(requisicao: SimulacaoRequisicaoModel): Observable<SimulacaoRetornoModel> {
    return this._http.post<SimulacaoRetornoModel>(`${this.apiUrl}/simuladorpadrao`, requisicao);
  }

  public recalcularNegociacao(requisicao: RecalculoRequisicaoModel): Observable<RecalculoRetornoModel> {
    return this._http.post<RecalculoRetornoModel>(`${this.apiUrl}/descontopadrao`, requisicao);
  }

  public baixarTitulosPago(pagos: BaixaPagamentoRequisicaoModel): Observable<BaixaPagamentoRetorno> {
    return this._http.post<BaixaPagamentoRetorno>(`${this.apiUrl}/baixapagamento`, pagos);
  }
}
