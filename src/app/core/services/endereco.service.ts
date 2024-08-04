// src/app/core/services/endereco.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { EnderecoRequestModel, EnderecoResponseModel } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) {}

  public obterEnderecos(request: EnderecoRequestModel): Observable<EnderecoResponseModel> {
    return this._http.post<EnderecoResponseModel>(`${this.apiUrl}/listarendereco`, request);
  }
}
