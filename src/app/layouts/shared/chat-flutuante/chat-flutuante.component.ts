import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ChatVisibilidadeService } from 'src/app/core/services/chat.flutuante.service';
import { ChatMessage, ChatUser } from './chat.model';

@Component({
  selector: 'app-chat-flutuante',
  templateUrl: './chat-flutuante.component.html',
  styleUrl: './chat-flutuante.component.scss'
})
export class ChatFlutuanteComponent {
  chatVisivel: boolean = false;
  minimizado: boolean = false;

  constructor(
    private chatVisibilidadeService: ChatVisibilidadeService,
    public formBuilder: UntypedFormBuilder
  ) {
    this.chatVisibilidadeService.chatVisivel.subscribe(visivel => {
      this.chatVisivel = visivel;
    });
  }

  ngOnInit(): void {

  }

  fecharChat(): void {
    this.chatVisibilidadeService.esconderChat();
  }

  minimizarChat(): void {
    this.minimizado = true;
  }

  restaurarChat(): void {
    this.minimizado = false;
  }
}
