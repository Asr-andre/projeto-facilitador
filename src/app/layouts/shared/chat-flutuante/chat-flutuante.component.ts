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
  public loadingMin: boolean = false;

  centro_custo = '66bba84b2e0f90a2984941c6';
  telefone: string = '';
  id = 1;
  canal = localStorage.getItem('canal');
  mensagemTemporaria: HistoricoItem | null = null;

  @ViewChild('chatCorpo') private chatCorpo: ElementRef;

  constructor(
    private chatVisibilidadeService: ChatVisibilidadeService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.inicializarForChat();
    this.chatVisibilidadeService.chatVisivel.subscribe(state => {
      this.chatVisivel = state.visivel;
      if (state.visivel && state.id) {
        this.carregarMensagens(state.id); // Carrega mensagens com o telefone
      }
    });

  }

  inicializarForChat() {
    this.envioMensagemForm = this.fb.group({
      numero: [this.telefone, [Validators.required]],
      canal: [this.canal],
      mensagem: ['', Validators.required],
      idcustom: [1],
      centro_custo: [this.centro_custo, Validators.required],
    });
  }

  carregarMensagens(telefone: string): void {
    if (!telefone) return;
    this.canal = localStorage.getItem('canal');
    this.loadingMin = true;

    this.chatVisibilidadeService.obterHistoricoChat(telefone, this.canal).subscribe(
      (response) => {
        if (response.success === 'true') {
          this.loadingMin = false;
           // Ordena as mensagens por data
        this.mensagens = response.mensagens.sort((a, b) => new Date(a.data_local).getTime() - new Date(b.data_local).getTime());
          this.telefone = response.telefone;
          this.envioMensagemForm.patchValue({ numero: this.telefone });
          setTimeout(() => this.scrollToBottom(), 100); // Desce para a última mensagem
          this.inicializarForChat();
        } else {
          this.loadingMin = false;
        }
      },
      (error) => {
        this.loadingMin = false;
        console.error('Erro ao carregar mensagens', error);
      }
    );
  }

  enviarMensagem() {
    this.loadingMin = true;
    this.chatVisibilidadeService.chat(this.envioMensagemForm.value).subscribe(response => {
      if (response.success === 'true') {
        this.loadingMin = false;
        this.carregarMensagens(this.telefone);
        this.envioMensagemForm.patchValue({ mensagem: '' }); // Limpa o campo mensagem
        setTimeout(() => this.scrollToBottom(), 100);
      } else {
        this.loadingMin = false;
        console.error('Falha no envio da mensagem:', response);
      }
    },
      (error) => {
        this.loadingMin = false;
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
    localStorage.removeItem(this.canal);
    this.mensagens = [];
    this.envioMensagemForm.reset(); // Limpa todos os campos do formulário
    this.telefone = ''; // Reseta o telefone para garantir que novas mensagens sejam atualizadas corretamente
  }

  minimizarChat(): void {
    this.minimizado = true;
  }

  restaurarChat(): void {
    this.minimizado = false;
  }

  public dataAtual(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
