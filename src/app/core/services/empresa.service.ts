import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmpresaModel } from '../models/empresa.model';
import { RetornoModel } from '../models/retorno.model';
import { AppConfig } from './url.base.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = AppConfig.apiUrl; 

  constructor(private _http: HttpClient) { }

  public cadastrar(empresa: EmpresaModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/empresa`, empresa);
  }
}
