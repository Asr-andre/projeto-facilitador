import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { CadastrarTituloRequest, CadastrarTituloResponse, ClienteModel, PesquisarClienteModel, Retorno } from '../../models/cadastro/cliente.model';
import { RetornoClienteModel } from '../../models/retorno.model';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public pesquisarCliente(dados: PesquisarClienteModel): Observable<Retorno> {
      return this._http.post<Retorno>(`${this.apiUrl}/listarclientemanual`, dados);
  }

  public cadastrarCliente(dados: ClienteModel): Observable<RetornoClienteModel> {
      return this._http.post<RetornoClienteModel>(`${this.apiUrl}/cliente`, dados);
    }

  public editarCliente(dados: ClienteModel): Observable<RetornoClienteModel> {
      return this._http.put<RetornoClienteModel>(`${this.apiUrl}/cliente`, dados);
    }

  public cadastrarTitulos(titulos: CadastrarTituloRequest): Observable<CadastrarTituloResponse> {
      return this._http.post<CadastrarTituloResponse>(`${this.apiUrl}/gerartitulos`, titulos);
    }
  }
