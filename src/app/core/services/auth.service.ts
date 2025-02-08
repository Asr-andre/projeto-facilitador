import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from '../config/url.base';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = AppConfig.apiUrl;
  private id_usuario = 'id_usuario';
  private sigla = 'sigla';
  private loginUsuario = 'login';
  private idEmpresa = 'id_empresa';

  constructor(private http: HttpClient) {}

  public login(sigla: string, login: string, senha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const loginUrl = `${this.apiUrl}/autenticar`;

    return this.http.post<any>(loginUrl, { sigla, login, senha }, { headers }).pipe(
      map(response => {
        if (response['success'] === 'true') {
          sessionStorage.setItem(this.id_usuario, JSON.stringify(response.id_usuario));
          sessionStorage.setItem(this.sigla, sigla);
          sessionStorage.setItem(this.loginUsuario, login);
          sessionStorage.setItem(this.idEmpresa, response['id_empresa']);
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

  sair(): Observable<any> {
    return this.http.post(this.apiUrl, {}); // Você pode enviar o ID do usuário ou outros dados, se necessário
  }

  public logout(): void {
    sessionStorage.removeItem(this.id_usuario);
    sessionStorage.removeItem(this.sigla);
    sessionStorage.removeItem(this.loginUsuario);
    sessionStorage.removeItem(this.idEmpresa);
    sessionStorage.removeItem('dadosCliente');
  }

  public getIdUsuario(): any {
    const user = sessionStorage.getItem(this.id_usuario);
    return user ? JSON.parse(user) : null;
  }

  public getSigla(): string {
    return sessionStorage.getItem(this.sigla);
  }

  public getLogin(): string {
    return sessionStorage.getItem(this.loginUsuario);
  }

  public getIdEmpresa(): string {
    return sessionStorage.getItem(this.idEmpresa);
  }
}
