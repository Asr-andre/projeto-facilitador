import { Injectable } from '@angular/core';
import { AppConfig } from './url.base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisicaoFormula, FormulaResponse } from '../models/formula.model';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) {}

  public listarFormulas(request: RequisicaoFormula): Observable<FormulaResponse> {
    return this._http.post<FormulaResponse>(`${this.apiUrl}/listarformulas`, request);
  }
}
