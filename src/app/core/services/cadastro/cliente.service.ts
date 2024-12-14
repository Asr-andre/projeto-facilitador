import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { Retorno } from '../../models/cadastro/cliente.model';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public pesquisarCliente(dado: string): Observable<Retorno> {
      return this._http.get<Retorno>(`${this.apiUrl}/listarcliente/${dado}`);
  }
}
