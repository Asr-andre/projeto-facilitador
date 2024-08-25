import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatVisibilidadeService {
  private chatVisivelSubject = new BehaviorSubject<{ visivel: boolean, id?: string }>({ visivel: false });

  chatVisivel = this.chatVisivelSubject.asObservable();

  constructor(private http: HttpClient) { }

  mostrarChat(id: string): void {
    this.chatVisivelSubject.next({ visivel: true, id });
  }

  esconderChat(): void {
    this.chatVisivelSubject.next({ visivel: false });
  }
}
