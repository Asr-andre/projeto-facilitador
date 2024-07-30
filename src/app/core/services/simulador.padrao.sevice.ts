import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { SimulacaoRequisicaoModel, SimulacaoRetornoModel } from '../models/simulador.padrao.model';

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
}
