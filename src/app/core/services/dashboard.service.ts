import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DevedorModel, RequisicaoDevedorModel, RespostaDevedorModel } from '../models/devedor.model';
import { DetalhamentoModel } from '../models/detalhamento.model';
import { AppConfig } from './url.base.service';
import { AuthenticationService } from './auth.service';
import { RequisicaoCardsModel, RespostaCardsModel } from '../models/cards.dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
    private _authService: AuthenticationService
  ) { }

  public obterDevedores(dados: RequisicaoDevedorModel): Observable<RespostaDevedorModel> {
    return this._http.post<RespostaDevedorModel>(`${this.apiUrl}/listarcliente`, dados);
  }

  public obterDevedorPorId(id_cliente: number, id_contratante: number): Observable<DetalhamentoModel> {
    const idEmpresa = parseInt(this._authService.getIdEmpresa(), 10);
    const requestBody = { id_empresa: idEmpresa, id_cliente, id_contratante };
    return this._http.post<DetalhamentoModel>(`${this.apiUrl}/tituloscliente`, requestBody);
  }

  public obterCards(empresa: RequisicaoCardsModel): Observable<RespostaCardsModel> {
    return this._http.post<RespostaCardsModel>(`${this.apiUrl}/envioscards`, empresa);
  }
}

