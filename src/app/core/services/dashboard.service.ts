import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequisicaoDevedorModel, RespostaDevedorModel } from '../models/devedor.model';
import { DetalhamentoModel, RequisicaoDetalhamentoModel } from '../models/detalhamento.model';
import { AppConfig } from '../config/url.base';
import { RequisicaoCardsModel, RespostaCardsModel } from '../models/cards.dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterDevedores(dados: RequisicaoDevedorModel): Observable<RespostaDevedorModel> {
    return this._http.post<RespostaDevedorModel>(`${this.apiUrl}/listarcliente`, dados);
  }

  public obterDevedorPorId(dados: RequisicaoDetalhamentoModel): Observable<DetalhamentoModel> {
    return this._http.post<DetalhamentoModel>(`${this.apiUrl}/tituloscliente`, dados);
  }

  public obterCards(empresa: RequisicaoCardsModel): Observable<RespostaCardsModel> {
    return this._http.post<RespostaCardsModel>(`${this.apiUrl}/envioscards`, empresa);
  }
}

