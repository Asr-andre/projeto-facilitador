import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { LogoutModel, Retorno } from '../models/logout.model';
import { LogsModel, LogsResponse } from '../models/logs.model';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public listarLogs(dados: LogsModel): Observable<LogsResponse> {
    return this._http.post<LogsResponse>(`${this.apiUrl}/listarlogs`, dados);
  }
}
