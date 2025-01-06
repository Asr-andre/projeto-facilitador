import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { EmailContaCadastroModel, RetornoEditarModel, RetornoEmailContaModel } from '../../models/cadastro/email.conta.model';
import { RequisicaoEmailPerfil, RetornoEmailPerfil } from '../../models/cadastro/email-perfil.model';

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

  public cadastrarEmailConta(dados: EmailContaCadastroModel): Observable<RetornoEmailContaModel>{
    return this._http.post<RetornoEmailContaModel>(`${this.apiUrl}/inserirperfilemail`, dados);
  }

  public editarEmailConta(dados: EmailContaCadastroModel): Observable<RetornoEditarModel>{
    return this._http.put<RetornoEditarModel>(`${this.apiUrl}/editarperfilemail`, dados);
  }
}
