import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('chatCorpo') private chatCorpo: ElementRef;

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

        this.envioMensagemForm.patchValue({ telefone: this.telefone });
        setTimeout(() => this.scrollToBottom(), 100);
      },
      (error) => {
        console.error('Erro ao carregar mensagens', error);
      }
    );
  }

  enviarMensagem() {
    this.chatVisibilidadeService.chat(this.envioMensagemForm.value).subscribe(response => {
      if (response.success === 'true') {
        this.carregarMensagens(this.telefone);
        this.envioMensagemForm.patchValue({ mensagem: '' }); // Limpa o campo mensagem
        setTimeout(() => this.scrollToBottom(), 100);
      } else {
        console.error('Falha no envio da mensagem:', response);
      }
    },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      }
    );
  }

  scrollToBottom(): void {
    try {
      this.chatCorpo.nativeElement.scrollTop = this.chatCorpo.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar para a última mensagem:', err);
    }
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
