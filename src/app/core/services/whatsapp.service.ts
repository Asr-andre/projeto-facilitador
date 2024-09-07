import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WhatsAppLoteRequestModel, WhatsAppLoteResponseModel, WhatsappMensagemModel } from '../models/whatsapp.model';
import { AppConfig } from './url.base.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private http: HttpClient) { }

  public enviarMensagem(mensagem: WhatsappMensagemModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviocampanhabestmessage`, mensagem);
  }

  public enviarMensagemLote(mensagem: WhatsAppLoteRequestModel): Observable<WhatsAppLoteResponseModel> {
    return this.http.post<WhatsAppLoteResponseModel>(`${this.apiUrl}/enviomensagemlote`, mensagem);
  }
}
