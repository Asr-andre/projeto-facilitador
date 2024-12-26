import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { CadastrarTituloRequest, CadastrarTituloResponse, Retorno } from '../../models/cadastro/cliente.model';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public pesquisarCliente(dado: string): Observable<Retorno> {
      return this._http.get<Retorno>(`${this.apiUrl}/listarcliente/${dado}`);
  }

  public cadastrarTitulos(titulos: CadastrarTituloRequest): Observable<CadastrarTituloResponse> {
      return this._http.post<CadastrarTituloResponse>(`${this.apiUrl}/gerartitulos`, titulos);
    }
}
