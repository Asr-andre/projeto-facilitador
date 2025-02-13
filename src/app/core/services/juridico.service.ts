import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { JuridicoRequestModel, JuridicoResponseModel } from '../models/juridico.model';
import { MovimentosRequestModel, MovimentosResponseModel } from '../models/movimento.model';

@Injectable({
  providedIn: 'root'
})
export class JuridicoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterProcessos(dados: JuridicoRequestModel): Observable<JuridicoResponseModel> {
    return this._http.post<JuridicoResponseModel>(`${this.apiUrl}/listarjuridico`, dados);
  }

  public obterMovimento(dados: MovimentosRequestModel): Observable<MovimentosResponseModel> {
    return this._http.post<MovimentosResponseModel>(`${this.apiUrl}/movimentos`, dados);
  }

  public cadastrarProcesso(dado: JuridicoResponseModel): Observable<any> {
    return this._http.post<JuridicoResponseModel>(`${this.apiUrl}/inserirjuridico`, dado);
  }

  public editarProcesso(dado: JuridicoResponseModel): Observable<any> {
    return this._http.put<JuridicoResponseModel>(`${this.apiUrl}/editarjuridico`, dado);
  }
}
