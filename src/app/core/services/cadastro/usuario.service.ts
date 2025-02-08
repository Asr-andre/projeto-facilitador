import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config/url.base';
import { UsuarioModel, UsuariosRetornoModel } from '../../models/cadastro/usuario.model';
import { RetornoModel } from '../../models/retorno.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public obterUsuariosPorEmpresa(idEmpresa: number): Observable<UsuariosRetornoModel> {
    return this._http.post<UsuariosRetornoModel>(`${this.apiUrl}/usuario/listarporempresa`, { id_empresa: idEmpresa });
  }

  public cadastrarUsuario(usuario: UsuarioModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/usuario`, usuario);
  }

  public editarUsuario(usuario: UsuarioModel): Observable<UsuariosRetornoModel> {
    return this._http.put<UsuariosRetornoModel>(`${this.apiUrl}/editarusuario`, usuario);
  }
}
