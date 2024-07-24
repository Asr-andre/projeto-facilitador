import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { RequisicaoAcaoCobrancaModel, RespostaAcaoCobrancaModel } from '../models/acoes.cobranca.model';


@Injectable({
  providedIn: 'root'
})
export class AcaoCobrancaService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public listarAcoesCobranca(requisicao: RequisicaoAcaoCobrancaModel): Observable<RespostaAcaoCobrancaModel> {
    return this._http.post<RespostaAcaoCobrancaModel>(`${this.apiUrl}/acoes`, requisicao);
  }
}
