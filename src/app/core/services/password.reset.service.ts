import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { RecuperacaoSenhaRequest, RecuperacaoSenhaResponse } from '../models/password.reset.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public recuperarSenha(requisicao: RecuperacaoSenhaRequest): Observable<RecuperacaoSenhaResponse> {
    return this._http.post<RecuperacaoSenhaResponse>(`${this.apiUrl}/atualizasenha`, requisicao);
  }

}
