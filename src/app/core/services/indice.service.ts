import { Injectable } from '@angular/core';
import { AppConfig } from './url.base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndiceModel, IndiceRequest, Retorno, RetornoIndice } from '../models/cadastro/indice.model';

@Injectable({
  providedIn: 'root'
})
export class IndiceService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) {}

  public listarIndice(request: IndiceRequest): Observable<RetornoIndice> {
    return this._http.post<RetornoIndice>(`${this.apiUrl}/listarindices`, request);
  }

  public cadastrarIndice(request: IndiceModel): Observable<Retorno> {
    return this._http.post<Retorno>(`${this.apiUrl}/inseririndices`, request);
  }

  public editarIndice(request: IndiceModel): Observable<Retorno> {
    return this._http.put<Retorno>(`${this.apiUrl}/editarindices`, request);
  }
}
