import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PixRequestModel, PixResponseModel } from '../models/solicitar.creditos.model';
import { AppConfig } from './url.base.service';


@Injectable({
  providedIn: 'root'
})
export class SolicitarCreditosService {

  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public gerarPix(request: PixRequestModel): Observable<PixResponseModel> {
    return this._http.post<PixResponseModel>(`${this.apiUrl}/gerarpixpagseguro`, request);
  }
}
