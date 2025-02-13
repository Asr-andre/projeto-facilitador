// src/app/core/services/endereco.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { EnderecoModel, EnderecoRequestModel, EnderecoResponseModel } from '../models/endereco.model';
import { RetornoModel } from '../models/retorno.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) {}

  public obterEnderecos(request: EnderecoRequestModel): Observable<EnderecoResponseModel> {
    return this._http.post<EnderecoResponseModel>(`${this.apiUrl}/listarendereco`, request);
  }

  public cadastrarEndereco(endereco: EnderecoModel): Observable<any> {
    return this._http.post<RetornoModel>(`${this.apiUrl}/inserirendereco`, endereco);
  }

  public editarEndereco(endereco: EnderecoModel): Observable<any> {
    return this._http.put<RetornoModel>(`${this.apiUrl}/editarendereco`, endereco);
  }
}
