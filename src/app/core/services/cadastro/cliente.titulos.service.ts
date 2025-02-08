import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetornoModel } from '../../models/retorno.model';
import { AppConfig } from '../../config/url.base';
import { ClienteTitulosModel } from '../../models/cadastro/cliente.titulos.model';


@Injectable({
  providedIn: 'root'
})
export class ClienteTituloService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public cadastrarTitulos(titulos: ClienteTitulosModel[]) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/titulo`, titulos);
  }
}
