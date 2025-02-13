import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { TelefoneModel, TelefoneRetornoModel } from '../models/telefone.model';
import { RetornoModel } from '../models/retorno.model';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterTelefonesPorCliente(idCliente: number): Observable<TelefoneRetornoModel> {
    return this._http.post<TelefoneRetornoModel>(`${this.apiUrl}/listartelefones`, { id_cliente: idCliente });
  }

  public cadastrarTelefone(telefone: TelefoneModel): Observable<any> {
    return this._http.post<RetornoModel>(`${this.apiUrl}/telefone`, telefone);
  }

  public editarTelefone(telefone: TelefoneModel): Observable<any> {
    return this._http.put<RetornoModel>(`${this.apiUrl}/telefone`, telefone);
  }
}
