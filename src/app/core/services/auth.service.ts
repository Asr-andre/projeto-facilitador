import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from './url.base.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = AppConfig.apiUrl;
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  public login(sigla: string, login: string, senha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const loginUrl = `${this.apiUrl}/autenticar`;

    return this.http.post<any>(loginUrl, { sigla, login, senha }, { headers }).pipe(
      map(response => {
        if (response['success: '] === 'true') { // Ajuste aqui para acessar corretamente 'success: '
          // Armazenar usuário no localStorage
          localStorage.setItem(this.currentUserKey, JSON.stringify(response));
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
    // Limpar usuário do localStorage ao fazer logout
    localStorage.removeItem(this.currentUserKey);
  }

  public getCurrentUser(): any {
    // Obter usuário do localStorage
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }
}
