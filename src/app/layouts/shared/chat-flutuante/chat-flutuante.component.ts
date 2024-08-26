import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ChatVisibilidadeService } from 'src/app/core/services/chat.flutuante.service';
import { ChatMessage, ChatUser } from './chat.model';
import { HistoricoItem } from 'src/app/core/models/chat.model';
import { Utils } from 'src/app/core/helpers/utils';

@Component({
  selector: 'app-chat-flutuante',
  templateUrl: './chat-flutuante.component.html',
  styleUrl: './chat-flutuante.component.scss'
})
export class ChatFlutuanteComponent {
  chatVisivel: boolean = false;
  minimizado: boolean = false;
  mensagemId: string;
  mensagens: HistoricoItem [] = [];

  constructor(
    private chatVisibilidadeService: ChatVisibilidadeService,
    public formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit(): void {
    this.chatVisibilidadeService.chatVisivel.subscribe(state => {
      this.chatVisivel = state.visivel;

      if (state.visivel && state.id) {
        this.carregarMensagens(state.id); // Carrega mensagens com o telefone
      }
    });
  }

  carregarMensagens(telefone: string): void {
    this.chatVisibilidadeService.obterHistoricoChat(telefone).subscribe(
      (response) => {
        this.mensagens = response.historico; // Atualiza as mensagens recebidas
      },
      (error) => {
        console.error('Erro ao carregar mensagens', error);
      }
    );
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

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
