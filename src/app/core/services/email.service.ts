import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { CadastrarEmailModel, EmailRetornoModel, EnvioEmailModel, RetornoEnvioModel } from '../models/email.model';
import { RetornoGenericoModel } from '../models/retorno.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterEmailPorCliente(idCliente: number): Observable<EmailRetornoModel> {
    return this._http.post<EmailRetornoModel>(`${this.apiUrl}/listaremails`, { id_cliente: idCliente });
  }

  public cadastrarEmail(email: CadastrarEmailModel): Observable<any> {
    return this._http.post<RetornoGenericoModel>(`${this.apiUrl}/email`, email);
  }

  public envioEmailUnitario(email: EnvioEmailModel): Observable<RetornoEnvioModel> {
    return this._http.post<RetornoEnvioModel>(`${this.apiUrl}/sendemail`, email).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Ocorreu um erro inesperado.';

    if (error.error instanceof ErrorEvent) {
      errorMsg = `Erro: ${error.error.message}`;
    } else {
      if (error.error && error.error.msg) {
        errorMsg = error.error.msg;
      } else {
        errorMsg = `Código: ${error.status}\nMensagem: ${error.message}`;
      }
    }

    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
