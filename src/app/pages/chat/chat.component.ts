import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ChatMessage, ChatUser } from './chat.model';
import { chatData, chatMessagesData } from './data';
import { SininhoService } from 'src/app/core/services/sininho.service';
import { Subscription, interval } from 'rxjs';
import { AlertaModel } from 'src/app/core/models/sininho.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  private pollingInterval = 60000; // 30 segundos
  private pollingSubscription: Subscription;
  public idEmpresa: number = Number(this.auth.getIdEmpresa() || 0);
  public resMsg: AlertaModel[] = [];


  chatMessagesData: ChatMessage[];
  chatData: ChatUser[];

  formData: UntypedFormGroup;

  chatSubmit: boolean;

  username: string;
  usermessage: string;
  status: string;
  image: string;

  constructor(public formBuilder: UntypedFormBuilder,
    private _sininhoService: SininhoService,
    private auth: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.monitorarMsg();

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this._fethchData();
    this.username = 'Frank Vickery';
    this.status = 'online';
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

      this.formData = this.formBuilder.group({
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

  formatarDataHora(dataString: string): string {
    const data = new Date(dataString);

    // Formatando a data para o formato DD/MM/YYYY
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Os meses são de 0 a 11
    const ano = data.getFullYear();

    // Formatando a hora para HH:MM
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');

    // Retornando a data e hora formatadas
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }
}
