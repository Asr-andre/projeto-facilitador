import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { LogoutModel, Retorno } from '../models/logout.model';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public logout(dados: LogoutModel): Observable<Retorno> {
    return this._http.post<Retorno>(`${this.apiUrl}/logout`, dados);
  }
}
