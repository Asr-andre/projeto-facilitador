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
  mensagemId: string;

  constructor(
    private chatVisibilidadeService: ChatVisibilidadeService,
    public formBuilder: UntypedFormBuilder
  ) {
    this.chatVisibilidadeService.chatVisivel.subscribe(({ visivel, id }) => {
      this.chatVisivel = visivel;
      if (id) {
        this.mensagemId = id;
        this.carregarMensagens(id); // Função que carrega as mensagens ou prepara o chat
      }
    });
  }

  ngOnInit(): void {

  }

  carregarMensagens(id: string): void {
    // Logica para carregar mensagens ou preparar o chat com base no id da mensagem
    console.log(`Carregando mensagens para o ID: ${id}`);
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
