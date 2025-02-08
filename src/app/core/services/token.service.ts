import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfig } from '../config/url.base';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private apiUrl = AppConfig.apiUrl;
  private initialTokenKey = 'initialToken';
  private defaultUser = {
    email: 'ptubbie@gmail.com',
    senha: 'p1t2b3@#'
  };

  constructor(private http: HttpClient) {}

  public initializeToken(): Observable<any> {
    const tokenUrl = `${this.apiUrl}/protocolo`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(tokenUrl, this.defaultUser, { headers }).pipe(
      tap(response => {
        const token = response && response.token;
        if (token) {
          this.setToken(token);
        } else {
          console.error('Token não encontrado na resposta:', response);
        }
      })
    );
  }

  public setToken(token: string): void {
    localStorage.setItem(this.initialTokenKey, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this.initialTokenKey);
  }

  public getToken(): string | null {
    const token = localStorage.getItem(this.initialTokenKey);
    return token;
  }

  public getTokenPayload(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const tokenPayload = this.parseJwt(token);
    return tokenPayload;
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
}
