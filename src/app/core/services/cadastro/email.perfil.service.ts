import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { RequisicaoEmailPerfil, RequisicaoPerfilEmail, RetornoEmailPerfil, RetornoPerfilEmail } from '../../models/cadastro/email-perfil.model';

@Injectable({
  providedIn: 'root'
})
export class EmailPerfilService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public obterEmailPerfil(dados: RequisicaoEmailPerfil): Observable<RetornoEmailPerfil>{
    return this._http.post<RetornoEmailPerfil>(`${this.apiUrl}/listaremailmensagens`, dados);
  }

  public cadastrarEmailPerfil(dados: RequisicaoPerfilEmail): Observable<RetornoPerfilEmail>{
    return this._http.post<RetornoPerfilEmail>(`${this.apiUrl}/inseriremailmensagens`, dados);
  }

  public editarEmailPerfil(dados: RequisicaoPerfilEmail): Observable<RetornoPerfilEmail>{
    return this._http.put<RetornoPerfilEmail>(`${this.apiUrl}/editaremailmensagens`, dados);
  }
}
