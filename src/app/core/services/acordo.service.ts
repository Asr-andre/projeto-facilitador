import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { AcordoRequisicaoModel, AcordoRespostaModel, RequisicaoConfissaoDividaModel, ResponseConfissaoDividaModel } from '../models/acordo.model';

@Injectable({
  providedIn: 'root'
})
export class AcordoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public listarAcordos(dados: AcordoRequisicaoModel): Observable<AcordoRespostaModel> {
    return this._http.post<AcordoRespostaModel>(`${this.apiUrl}/listaracordo`, dados);
  }

  public imprimirConfissaoDivida(dados: RequisicaoConfissaoDividaModel): Observable<ResponseConfissaoDividaModel> {
    return this._http.post<ResponseConfissaoDividaModel>(`${this.apiUrl}/gerarconfissao`, dados);
  }
}
