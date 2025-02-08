import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { TitulosPgRetRequestModel, TitulosPgRetResponseModel } from '../models/titulos.pg.ret.model';

@Injectable({
  providedIn: 'root'
})
export class TitulosPgRetService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public obterTitulosPagosRet(titulo: TitulosPgRetRequestModel): Observable<TitulosPgRetResponseModel> {
    return this._http.post<TitulosPgRetResponseModel>(`${this.apiUrl}/listarpagamento`,  titulo );
  }
}
