import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { RetornoSmsEnvio, SmsModel } from '../models/sms.model';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public envioSmsUnitario(sms: SmsModel): Observable<any> {
    return this._http.post<RetornoSmsEnvio>(`${this.apiUrl}/enviosms`, sms);
  }

}
