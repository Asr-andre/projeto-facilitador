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
      numero: [this.telefone, [Validators.required]],
      canal: [this.canal],
      mensagem: ['', Validators.required],
      idcustom: [1],
      centro_custo: [this.centro_custo, Validators.required],
    });
  }

  carregarMensagens(telefone: string): void {
    this.loadingMin = true;
    this.chatVisibilidadeService.obterHistoricoChat(telefone).subscribe(
      (response) => {
        if (response.success === 'true') {
          this.loadingMin = false;
          this.mensagens = response.historico; // Atualiza as mensagens recebidas
          this.telefone = response.telefone;
          this.envioMensagemForm.patchValue({ numero: this.telefone });
          setTimeout(() => this.scrollToBottom(), 100); // Desce para a última mensagem
          console.log(telefone)
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
    console.log(this.envioMensagemForm.value)
    this.loadingMin = true;
    this.chatVisibilidadeService.chat(this.envioMensagemForm.value).subscribe(response => {
      if (response.success === 'true') {
        this.loadingMin = false;
        this.carregarMensagens(this.telefone);
        this.envioMensagemForm.patchValue({ mensagem: '' }); // Limpa o campo mensagem
        this.canal = localStorage.getItem('canal');
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
