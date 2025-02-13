import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoricoChat, MensagemRequestModel, MensagemResponseModel, RequisicaoChatModel } from '../models/chat.model';
import { AppConfig } from '../config/url.base';

@Injectable({
  providedIn: 'root'
})
export class ChatVisibilidadeService {
  private chatVisivelSubject = new BehaviorSubject<{ visivel: boolean, id?: string }>({ visivel: false });

  chatVisivel = this.chatVisivelSubject.asObservable();
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public mostrarChat(id: string): void {
    this.chatVisivelSubject.next({ visivel: true, id });
  }

  public obterHistoricoChat(telefone: string, canal: string): Observable<HistoricoChat> {
    const requisicao: RequisicaoChatModel = { numero: telefone, canal: canal }; // Cria o objeto para a requisição
    return this.http.post<HistoricoChat>(`${this.apiUrl}/enviomensagemchat`, requisicao);
  }

  public chat(chat: MensagemRequestModel): Observable<MensagemResponseModel> {
    return this.http.post<MensagemResponseModel>(`${this.apiUrl}/enviomensagemoperador`, chat);
  }

  public esconderChat(): void {
    this.chatVisivelSubject.next({ visivel: false });
  }
}
