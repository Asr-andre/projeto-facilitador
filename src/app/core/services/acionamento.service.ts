import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { AcionamentoResponseModel, InserirAcionamentoModel, RequisicaoAcionamentoModel, RetornoAcionamentoModel } from '../models/acionamento.model';


@Injectable({
  providedIn: 'root'
})
export class AcionamentoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) {}

  public listarAcionamentos(dados: RequisicaoAcionamentoModel): Observable<RetornoAcionamentoModel> {
    return this._http.post<RetornoAcionamentoModel>(`${this.apiUrl}/acionamentos`, dados);
  }

  public inserirAcionamento(acionamento: InserirAcionamentoModel): Observable<AcionamentoResponseModel> {
    return this._http.post<AcionamentoResponseModel>(`${this.apiUrl}/inseriracionamentos`, acionamento);
  }
}
