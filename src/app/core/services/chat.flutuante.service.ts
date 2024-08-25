import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatVisibilidadeService {
  private chatVisivelSubject = new BehaviorSubject<boolean>(false);

  chatVisivel = this.chatVisivelSubject.asObservable();

  mostrarChat(): void {
    this.chatVisivelSubject.next(true);
  }

  esconderChat(): void {
    this.chatVisivelSubject.next(false);
  }
}
