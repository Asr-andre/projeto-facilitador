import { Injectable } from '@angular/core';
import { AppConfig } from './url.base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormulaResponse } from '../models/formula.model';
import { IndiceRequestModel } from '../models/cadastro/indice.model';

@Injectable({
  providedIn: 'root'
})
export class IndiceService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) {}

  public listarIndice(request: IndiceRequestModel): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/listarindices`, request);
  }
}
