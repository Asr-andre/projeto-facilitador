import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetornoWathsappModel, WhatsAppLoteRequestModel, WhatsAppLoteResponseModel, WhatsappMensagemModel } from '../models/whatsapp.model';
import { AppConfig } from '../config/url.base';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private http: HttpClient) { }

  public enviarMensagem(mensagem: WhatsappMensagemModel): Observable<RetornoWathsappModel> {
    return this.http.post<RetornoWathsappModel>(`${this.apiUrl}/enviocampanhabestmessage`, mensagem);
  }

  public enviarMensagemLote(mensagem: WhatsAppLoteRequestModel): Observable<WhatsAppLoteResponseModel> {
    return this.http.post<WhatsAppLoteResponseModel>(`${this.apiUrl}/enviomensagemlote`, mensagem);
  }
}
