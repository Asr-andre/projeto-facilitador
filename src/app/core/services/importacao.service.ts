import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { ImportacaoRetornoModel } from '../models/importacao.model';
import { Cadastro } from '../models/cadastro.model';

@Injectable({
  providedIn: 'root'
})
export class ImportacaoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public listarImportacoesRealizada(idEmpresa: number): Observable<ImportacaoRetornoModel> {
    return this._http.post<ImportacaoRetornoModel>(`${this.apiUrl}/listarimportacao`, { id_empresa: idEmpresa });
  }

  public uploadFile(file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/json'
    });

    return this._http.post(`${this.apiUrl}/arquivo`, file, { headers: headers, reportProgress: true, observe: 'events' });
  }

  public enviarDadosFormulario(idEmpresa: number, idContratante: number, userLogin: string): Observable<any> {
    const body = {
      id_empresa: idEmpresa,
      id_contratante: idContratante,
      user_login: userLogin
    };

    return this._http.post(`${this.apiUrl}/importacao`, body);
  }

  public loadImportacaoManual(): Observable<Cadastro[]> {
    return this._http.get<Cadastro[]>('assets/base/importacao-manual.json');
  }
}
