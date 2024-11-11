import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { JuridicoRequestModel, JuridicoResponseModel } from '../models/juridico.model';

@Injectable({
  providedIn: 'root'
})
export class JuridicoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public obterBoletoPix(dados: JuridicoRequestModel): Observable<JuridicoResponseModel> {
    return this._http.post<JuridicoResponseModel>(`${this.apiUrl}/listarjuridico`, dados);
  }
}
