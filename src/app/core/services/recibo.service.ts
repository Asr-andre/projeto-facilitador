import { Injectable } from '@angular/core';
import { AppConfig } from './url.base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  RequisicaoReciboImprimirModel,
  RequisicaoReciboModel,
  RequisicaoRetornoImprimirModel,
  RetornoReciboModel
} from '../models/recibo.model';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {
  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) {}

  public obterRecibos(dados: RequisicaoReciboModel): Observable<RetornoReciboModel> {
    return this._http
      .post<RetornoReciboModel>(`${this.apiUrl}/listarrecibo`, dados)
      .pipe(catchError(this.handleError));
  }

  public imprimirRecibos(dados: RequisicaoReciboImprimirModel): Observable<RequisicaoRetornoImprimirModel> {
    return this._http
      .post<RequisicaoRetornoImprimirModel>(`${this.apiUrl}/imprimirrecibo`, dados)
      .pipe(catchError(this.handleError));
  }

  // Método para tratar erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido.';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Erro do servidor: ${error.status} - ${error.message}`;
    }
    // Retornar um Observable com um erro
    return throwError(() => new Error(errorMessage));
  }
}
