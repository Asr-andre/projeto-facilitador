import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from './url.base.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = AppConfig.apiUrl;
  private id_usuario = 'id_usuario';
  private siglaKey = 'sigla';
  private loginKey = 'login';
  private idEmpresaKey = 'id_empresa';

  constructor(private http: HttpClient) {}

  public login(sigla: string, login: string, senha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const loginUrl = `${this.apiUrl}/autenticar`;

    return this.http.post<any>(loginUrl, { sigla, login, senha }, { headers }).pipe(
      map(response => {
        if (response['success'] === 'true') {
          // Armazenar usuário, sigla e login no localStorage
          localStorage.setItem(this.id_usuario, JSON.stringify(response.id_usuario));
          localStorage.setItem(this.siglaKey, sigla);
          localStorage.setItem(this.loginKey, login);
          localStorage.setItem(this.idEmpresaKey, response['id_empresa']);
          return response;
        } else {
          throw new Error(response['msg: '] || 'Erro ao tentar autenticar.');
        }
      }),
      catchError(error => {
        return throwError('Ocorreu um erro ao tentar autenticar. Por favor, tente novamente.');
      })
    );
  }

  public logout(): void {
    // Limpar usuário, sigla e login do localStorage ao fazer logout
    localStorage.removeItem(this.id_usuario);
    localStorage.removeItem(this.siglaKey);
    localStorage.removeItem(this.loginKey);
    localStorage.removeItem(this.idEmpresaKey);
  }

  public getCurrentUser(): any {
    // Obter usuário do localStorage
    const user = localStorage.getItem(this.id_usuario);
    return user ? JSON.parse(user) : null;
  }

  public getSigla(): string {
    return localStorage.getItem(this.siglaKey);
  }

  public getLogin(): string {
    return localStorage.getItem(this.loginKey);
  }

  public getIdEmpresa(): string {
    return localStorage.getItem(this.idEmpresaKey);
  }
}
