import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { TipoTituloModel } from '../models/tipo.titulo.model';



@Injectable({
  providedIn: 'root'
})
export class TipoTituloService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public obterTipoTitulo(): Observable<TipoTituloModel> {
    return this._http.get<TipoTituloModel>(`${this.apiUrl}/tipotitulos`);
  }
}
