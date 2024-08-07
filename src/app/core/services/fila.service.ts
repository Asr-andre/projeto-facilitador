// src/app/core/services/endereco.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { FilaRequisicaoModel, FilaRetornoModel } from '../models/fila.model';

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) {}

  public obterFilas(request: FilaRequisicaoModel): Observable<FilaRetornoModel> {
    return this._http.post<FilaRetornoModel>(`${this.apiUrl}/listarfilas`, request);
  }
}
