import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { GerarPixRequest, GerarPixResponse } from '../models/geraca.pix.model';


@Injectable({
  providedIn: 'root'
})
export class GeracaoPixService {

  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public gerarPixBoleto(request: GerarPixRequest): Observable<GerarPixResponse> {
    return this._http.post<GerarPixResponse>(`${this.apiUrl}/gerarboletopixpagseguro`, request);
  }

  //intregração integração saad
  public gerarboleto(request: GerarPixRequest): Observable<GerarPixResponse> {
    return this._http.post<GerarPixResponse>(`${this.apiUrl}/gerarboleto`, request);
  }
}
