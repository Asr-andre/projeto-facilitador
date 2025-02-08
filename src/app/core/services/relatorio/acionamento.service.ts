import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../config/url.base';
import { Observable } from 'rxjs';
import { RequisicaoAcionamentoModel, RetornoAcionamentoModel, RetornoModel } from '../../models/relatorio/acionamento.model';

@Injectable({
  providedIn: 'root'
})
export class AcionamentoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public obterAcionamentosSintetico(dados: RequisicaoAcionamentoModel): Observable<RetornoAcionamentoModel>{
    return this._http.post<RetornoAcionamentoModel>(`${this.apiUrl}/acionamentossintetico`, dados);
  }

  public obterAcionamentosAnalitico(dados: RequisicaoAcionamentoModel): Observable<RetornoModel>{
    return this._http.post<RetornoModel>(`${this.apiUrl}/acionamentosanalitico`, dados);
  }
}
