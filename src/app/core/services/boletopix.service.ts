import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { RequisicaoBoletoPixModel, RespostaBoletoPixModel } from '../models/boletopix.model';

@Injectable({
  providedIn: 'root'
})
export class BoletoPixService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  public obterBoletoPix(boletoPix: RequisicaoBoletoPixModel): Observable<RespostaBoletoPixModel> {
    return this._http.post<RespostaBoletoPixModel>(`${this.apiUrl}/listarboletos`, boletoPix);
  }
}
