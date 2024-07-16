import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
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

  public envioEmailUnitario(email: EnvioEmailModel): Observable<any> {
    return this._http.post<RetornoEnvioModel>(`${this.apiUrl}/sendemail`, email);
  }

}
