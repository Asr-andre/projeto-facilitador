import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { ImportacaoRequisicaoModel, ImportacaoRetornoModel } from '../models/importacao.model';

@Injectable({
  providedIn: 'root'
})
export class ImportacaoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public listarImportacoesRealizada(idEmpresa: number): Observable<ImportacaoRetornoModel> {
    return this._http.post<ImportacaoRetornoModel>(`${this.apiUrl}/listarimportacao`, { id_empresa: idEmpresa });
  }

  uploadFile(formData: FormData): Observable<any> {
    return this._http.post(`${this.apiUrl}/importacao`, formData);
  }
}
