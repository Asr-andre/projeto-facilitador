import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { RequisicaoModel, RespostaModel } from '../models/sininho.model';

@Injectable({
  providedIn: 'root'
})
export class SininhoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public monitorarMsg(requestBody: RequisicaoModel): Observable<RespostaModel> {
    return this.http.post<RespostaModel>(`${this.apiUrl}/enviomensagemalerta`, requestBody);
  }
}
