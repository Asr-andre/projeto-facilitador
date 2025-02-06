import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { RequisicaoContaBancaria, RespostaContaBancaria } from '../../models/cadastro/conta.bancaria.model';

@Injectable({
  providedIn: 'root'
})
export class ContaBancariaService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public obterContaBancaria(dados: RequisicaoContaBancaria): Observable<RespostaContaBancaria> {
    return this._http.post<RespostaContaBancaria>(`${this.apiUrl}/listarboletoperfil`, dados);
  }
}
