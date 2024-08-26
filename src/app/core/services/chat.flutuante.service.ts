import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoricoChat, HistoricoItem, RequisicaoChatModel } from '../models/chat.model';
import { AppConfig } from './url.base.service';

@Injectable({
  providedIn: 'root'
})
export class ChatVisibilidadeService {
  private chatVisivelSubject = new BehaviorSubject<{ visivel: boolean, id?: string }>({ visivel: false });

  chatVisivel = this.chatVisivelSubject.asObservable();
  private apiUrl = AppConfig.apiUrl;

  constructor(private http: HttpClient) { }

  mostrarChat(id: string): void {
    this.chatVisivelSubject.next({ visivel: true, id });
  }

  obterHistoricoChat(telefone: string): Observable<HistoricoChat> {
    const requisicao: RequisicaoChatModel = { numero: telefone }; // Cria o objeto para a requisição
    return this.http.post<HistoricoChat>(`${this.apiUrl}/consultamensagemhistorico`, requisicao);
  }


  esconderChat(): void {
    this.chatVisivelSubject.next({ visivel: false });
  }
}
