import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/url.base';
import { RequisicaoBancos, RetornoBanco } from '../models/bancos.model';


@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public obterBancos(dados: RequisicaoBancos): Observable<RetornoBanco> {
    return this._http.post<RetornoBanco>(`${this.apiUrl}/listarbancos`, dados);
  }
}
