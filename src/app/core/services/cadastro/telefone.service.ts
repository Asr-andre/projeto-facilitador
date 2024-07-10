import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../url.base.service';
import { TelefoneModel } from '../../models/telefone.model';
import { RetornoModel } from '../../models/retorno.model';



@Injectable({
  providedIn: 'root'
})
export class TelefoneService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  public obterTelefonesPorCliente(idCliente: number): Observable<TelefoneModel[]> {
    return this._http.get<TelefoneModel[]>(`${this.apiUrl}/telefone/${idCliente}`);
  }

  public cadastrarTelefone(telefone: TelefoneModel): Observable<any> {
    return this._http.post<RetornoModel>(`${this.apiUrl}/telefone`, telefone);
  }
}
