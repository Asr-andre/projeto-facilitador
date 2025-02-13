import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from '../config/url.base';
import { AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = AppConfig.apiUrl;
  private idUsuarioKey = 'id_usuario';
  private siglaKey = 'sigla';
  private loginUsuarioKey = 'login';
  private idEmpresaKey = 'id_empresa';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  public login(sigla: string, login: string, senha: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const loginUrl = `${this.apiUrl}/autenticar`;

    return this.http.post<AuthResponse>(loginUrl, { sigla, login, senha }, { headers }).pipe(
      map(response => {
        if (response.success === 'true') {
          sessionStorage.setItem(this.idUsuarioKey, response.id_usuario);
          sessionStorage.setItem(this.siglaKey, sigla);
          sessionStorage.setItem(this.loginUsuarioKey, login);
          sessionStorage.setItem(this.idEmpresaKey, response.id_empresa);
          sessionStorage.setItem(this.tokenKey, response.token); // Armazenando o token

          return response;
        } else {
          throw new Error(response.msg || 'Erro ao tentar autenticar.');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Ocorreu um erro ao tentar autenticar. Por favor, tente novamente.'));
      })
    );
  }

  public logout(): void {
    sessionStorage.removeItem(this.idUsuarioKey);
    sessionStorage.removeItem(this.siglaKey);
    sessionStorage.removeItem(this.loginUsuarioKey);
    sessionStorage.removeItem(this.idEmpresaKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('dadosCliente');
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  public getIdUsuario(): string | null {
    return sessionStorage.getItem(this.idUsuarioKey);
  }

  public getSigla(): string | null {
    return sessionStorage.getItem(this.siglaKey);
  }

  public getLogin(): string | null {
    return sessionStorage.getItem(this.loginUsuarioKey);
  }

  public getIdEmpresa(): string | null {
    return sessionStorage.getItem(this.idEmpresaKey);
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
