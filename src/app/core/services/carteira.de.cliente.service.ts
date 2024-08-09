import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { CarteiraClienteRequisicao, CarteiraClientesResponse } from '../models/carteira.de.cliente.model';



@Injectable({
  providedIn: 'root'
})
export class CarteiraDeClienteService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public obterCarteiradeCliente(carteira: CarteiraClienteRequisicao): Observable<CarteiraClientesResponse> {
    return this._http.post<CarteiraClientesResponse>(`${this.apiUrl}/gerarcarteira`, carteira);
  }
}
