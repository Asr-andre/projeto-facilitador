import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { EmailContaCadastroModel, EmailContaRequestModel, EmailContaResponseModel, RetornoEmailContaModel } from '../../models/cadastro/email.conta.model';

@Injectable({
  providedIn: 'root'
})
export class EmailContaService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public obterEmailConta(dados: EmailContaRequestModel): Observable<EmailContaResponseModel>{
    return this._http.post<EmailContaResponseModel>(`${this.apiUrl}/listarperfilemail`, dados);
  }

  public cadastrarEmailConta(dados: EmailContaCadastroModel): Observable<RetornoEmailContaModel>{
    return this._http.post<RetornoEmailContaModel>(`${this.apiUrl}/inserirperfilemail`, dados);
  }
}
