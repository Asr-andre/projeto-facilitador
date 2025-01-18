import { Injectable } from '@angular/core';
import { AppConfig } from './url.base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisicaoReciboModel, RetornoReciboModel } from '../models/recibo.nodel';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterRecibos(dados: RequisicaoReciboModel): Observable<RetornoReciboModel> {
      return this._http.post<RetornoReciboModel>(`${this.apiUrl}/listarrecibo`, dados);
    }
}
