import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmpresaModel } from '../models/cadastro/empresa.model';
import { RetornoModel } from '../models/retorno.model';
import { AppConfig } from './url.base.service';
import { ContratanteModel } from '../models/cadastro/contratante.model';
import { UsuarioModel } from '../models/cadastro/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public cadastrarEmpresa(empresa: EmpresaModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/empresa`, empresa);
  }

  public cadastrarContratante(contratante: ContratanteModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/contratante`, contratante);
  }

  public cadastrarUsuario(usuario: UsuarioModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/usuario`, usuario);
  }

  importarClientes(clientes: any[]): Observable<any> {
    return this._http.post('/api/importar-clientes', { clientes });
  }
}
