import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ChatMessage, ChatUser } from './chat.model';
import { chatData, chatMessagesData } from './data';
import { SininhoService } from 'src/app/core/services/sininho.service';
import { Subscription, interval } from 'rxjs';
import { AlertaModel } from 'src/app/core/models/sininho.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/helpers/utils';
import { HistoricoItem } from 'src/app/core/models/chat.model';
import { ChatVisibilidadeService } from 'src/app/core/services/chat.flutuante.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  private pollingInterval = 60000; // 30 segundos
  private pollingSubscription: Subscription;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public resMsg: AlertaModel[] = [];
  chatSelecionado: any; // Item atualmente selecionado

  mensagens: HistoricoItem [] = [];
  envioMensagemForm: FormGroup;
  public loading: boolean = false;

  centro_custo = '66bba84b2e0f90a2984941c6';
  telefone: string = '';
  id = 1;
  canal = localStorage.getItem('canal');
  mensagemTemporaria: HistoricoItem | null = null;


  chatMessagesData: ChatMessage[];
  chatData: ChatUser[];

  formData: UntypedFormGroup;

  chatSubmit: boolean;

  username: string;
  usermessage: string;
  status: string;
  image: string;

  constructor(
    public _formBuilder: UntypedFormBuilder,
    private _sininhoService: SininhoService,
    private _chatVisibilidade: ChatVisibilidadeService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.monitorarMsg();
    this.inicializarForChat();

    this.formData = this._formBuilder.group({
      message: ['', [Validators.required]],
    });

    this._fethchData();
    this.username = 'Frank Vickery';
    this.status = 'online';
  }

  inicializarForChat() {
    this.envioMensagemForm = this._fb.group({
      numero: [this.telefone, [Validators.required]],
      canal: [this.canal],
      mensagem: ['', Validators.required],
      idcustom: [1],
      centro_custo: [this.centro_custo, Validators.required],
    });
  }

  selecionarChat(chat: any): void {
    this.chatSelecionado = chat;
    this.carregarMensagens(chat.telefone, chat.canal);
  }

  carregarMensagens(telefone: string, canal: string): void {
    this.loading = true;
    this._chatVisibilidade.obterHistoricoChat(telefone, canal).subscribe(
      (response) => {
        if (response.success === 'true') {
          this.loading = false;
           // Ordena as mensagens por data
        this.mensagens = response.mensagens.sort((a, b) => new Date(a.data_local).getTime() - new Date(b.data_local).getTime());
          this.telefone = response.telefone;
          this.envioMensagemForm.patchValue({ numero: this.telefone });
        } else {
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        console.error('Erro ao carregar mensagens', error);
      }
    );
  }

  private _fethchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }

  chatUsername(name, image, status) {
    this.username = name;
    this.image = image;
    this.usermessage = 'Hello';
    this.chatMessagesData = [];
    const currentDate = new Date();
    this.status = status;

    this.chatMessagesData.push({
      image: this.image,
      name: this.username,
      message: this.usermessage,
      time: currentDate.getHours() + ':' + currentDate.getMinutes(),
      status: this.status
    });
  }

  get form() {
    return this.formData.controls;
  }

  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: 'right',
        name: 'Ricky Clark',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });

      this.formData = this._formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  public monitorarMsg(): void {
    const requestBody = {
      id_empresa: this.idEmpresa
    };

    // Fazer a chamada inicial imediatamente
    this._sininhoService.monitorarMsg(requestBody).subscribe(res => {
      this.resMsg = res.alertas;
    });

    // Iniciar o polling
    this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
      this._sininhoService.monitorarMsg(requestBody).subscribe(res => {
        this.resMsg = res.alertas;
      });
    });
  }

  public dataAtual(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public somenteData(data: Date): string {
    const dataFormatada = new Date(data);
    const dia = dataFormatada.getDate().toString().padStart(2, '0');
    const mes = (dataFormatada.getMonth() + 1).toString().padStart(2, '0'); // +1 porque os meses começam do zero
    const ano = dataFormatada.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  public horaAtual(dataIso: string): string {
    if (!dataIso) return '';
    const data = new Date(dataIso);

    data.setHours(data.getHours() + 3);
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    const segundo = data.getSeconds().toString().padStart(2, '0');

    return `${hora}:${minuto}`;
  }

}
