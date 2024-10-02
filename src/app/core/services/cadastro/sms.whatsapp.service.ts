import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../url.base.service';
import { CadastroMensagemModel, SmsWhatsappRequestModel, SmsWhatsappResponseModel, WhatsappResponseModel } from '../../models/cadastro/sms.whatsapp.model';

@Injectable({
  providedIn: 'root'
})
export class SmsWhatsAppService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public obterMsg(dados: SmsWhatsappRequestModel): Observable<SmsWhatsappResponseModel> {
    return this._http.post<SmsWhatsappResponseModel>(`${this.apiUrl}/listarperfilwhatsapp`, dados);
  }

  public cadastrarMsg(dados: CadastroMensagemModel): Observable<WhatsappResponseModel> {
    return this._http.post<WhatsappResponseModel>(`${this.apiUrl}/inserirperfilwhatsapp`, dados);
  }

  public editarMsg(dados: CadastroMensagemModel): Observable<WhatsappResponseModel> {
    return this._http.put<WhatsappResponseModel>(`${this.apiUrl}/editarperfilwhatsapp`, dados);
  }
}
