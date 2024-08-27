import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ChatVisibilidadeService } from 'src/app/core/services/chat.flutuante.service';
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
  envioMensagemForm: FormGroup;

  telefone: string = '';
  id: string =  '';

  constructor(
    private chatVisibilidadeService: ChatVisibilidadeService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.chatVisibilidadeService.chatVisivel.subscribe(state => {
      this.chatVisivel = state.visivel;

      if (state.visivel && state.id) {
        this.carregarMensagens(state.id); // Carrega mensagens com o telefone
      }
    });

    this.inicializarForChat();
  }

  inicializarForChat() {
    this.envioMensagemForm = this.fb.group({
      centro_custo: ['', Validators.required],
      telefone: [this.telefone, [Validators.required, Validators.pattern(/^\d{10,11}$/)]], // Valida números com 10-11 dígitos
      mensagem: ['', Validators.required]
    });
  }

  carregarMensagens(telefone: string): void {
    this.chatVisibilidadeService.obterHistoricoChat(telefone).subscribe(
      (response) => {
        this.mensagens = response.historico; // Atualiza as mensagens recebidas
        this.telefone = response.telefone;
        this.id = response.telefone;
      },
      (error) => {
        console.error('Erro ao carregar mensagens', error);
      }
    );
  }

  enviarMensagem() {
    this.chatVisibilidadeService.chat(this.envioMensagemForm.value).subscribe(response => {
      this.carregarMensagens(this.telefone);
      this.inicializarForChat();
    });
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

  formatarHora(dataString: string): string {
    const data = new Date(dataString);
    return `${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}`;
  }
}
