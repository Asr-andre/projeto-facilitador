import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DevedorModel } from '../models/devedor.model';
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

  public obterDevedores(): Observable<DevedorModel[]> {
    const idEmpresa = parseInt(this._authService.getIdEmpresa(), 10);
    const requestBody = { id_empresa: idEmpresa };
    return this._http.post<DevedorModel[]>(`${this.apiUrl}/listarcliente`, requestBody);
  }

  public obterDevedorPorId(id_cliente: number, id_contratante: number): Observable<DetalhamentoModel> {
    const idEmpresa = parseInt(this._authService.getIdEmpresa(), 10);
    const requestBody = { id_empresa: idEmpresa, id_cliente, id_contratante };
    return this._http.post<DetalhamentoModel>(`${this.apiUrl}/tituloscliente`, requestBody);
  }

  public obterCards(): Observable<RespostaCardsModel> {
    const idEmpresa = parseInt(this._authService.getIdEmpresa(), 10);
    const requestBody: RequisicaoCardsModel = { id_empresa: idEmpresa };
    return this._http.post<RespostaCardsModel>(`${this.apiUrl}/envioscards`, requestBody);
  }

}

