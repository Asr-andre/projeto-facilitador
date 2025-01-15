import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilWhatsappModel } from 'src/app/core/models/cadastro/sms.whatsapp.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SmsWhatsAppService } from 'src/app/core/services/cadastro/sms.whatsapp.service';
import { WhatsappService } from 'src/app/core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {
  @ViewChild('whatsappModal') whatsappModal: TemplateRef<any>;
  public abrirModal = false;
  public telefoneCliente: string;
  public whatsappForm: FormGroup;
  @Input() idCliente: number | undefined;
  @Input() nomeCliente: string | undefined;
  public maxCaractere: number = 4096;
  public msg: PerfilWhatsappModel[] = [];
  public idPerfilWhatsapp = 1;
  public loadingMin: boolean = false;
  public assuntoSelecionado: string = "";

  public mensagem: string = '';

  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public centrocusto = '66bba84b2e0f90a2984941c6';
  public callbackRetorno = 'http://portal.facilitadorsistemas.com.br:3000/retornobestmessage';

  constructor(
    private fb: FormBuilder,
    private _whatsappService: WhatsappService,
    private _auth: AuthenticationService,
    private _modalService: NgbModal,
    private _alertService: AlertService,
    private _smsWhatsAppService: SmsWhatsAppService,
  ) { }

  ngOnInit(): void {
    this.inicializarwhatsappForm();
  }

  public inicializarwhatsappForm() {
    this.whatsappForm = this.fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      centrocusto: [this.centrocusto, Validators.required],
      user_login: [this.login, Validators.required],
      whats: this.fb.array([
        this.fb.group({
          numero: [this.telefoneCliente, Validators.required],
          mensagem: ['', Validators.required],
          idCustom: [this.idEmpresa, Validators.required],
          cpf: [this.nomeCliente, Validators.required],
          contrato: [this.idCliente, Validators.required],
          callbackRetorno: [this.callbackRetorno, Validators.required]
        })
      ])
    });
  }

  public obterMsgs() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_PerfilWhatsapp: this.idPerfilWhatsapp,
      user_login: this.login
    }

    this.loadingMin = true;
    this._smsWhatsAppService.obterMsg(dados).subscribe((res) => {
      this.loadingMin = false;
      if (res.success === "true") {
        this.loadingMin = false;
        this.msg = res.perfil_whatsapp;
      } else {
        this.loadingMin = false;
        this._alertService.warning(res.msg);
      }
    });
  }

  public substituirVariaveisNaMensagem(): void {
    // Obtendo os dados do cliente do localStorage
    const dadosCliente = JSON.parse(localStorage.getItem('dadosCliente') || '{}');

    // Verificando se os dados existem
    if (!dadosCliente || Object.keys(dadosCliente).length === 0) {
      this._alertService.warning('Os dados do cliente não foram encontrados no localStorage.');
      return;
    }

    // Obtendo o array de mensagens do formulário
    const whatsArray = this.whatsappForm.get('whats') as FormArray;
    const mensagemControl = whatsArray.at(0).get('mensagem');

    if (!mensagemControl) {
      this._alertService.error('Erro ao acessar o campo de mensagem no formulário.');
      return;
    }

    // Obtendo a mensagem original
    let mensagemOriginal = mensagemControl.value || '';
    const primeiroNome = dadosCliente.nome ? dadosCliente.nome.split(' ')[0] : '';

    // Substituindo as variáveis na mensagem
    mensagemOriginal = mensagemOriginal
      .replace(/@clientes_nome/g, dadosCliente.nome || '')
      .replace(/@clientes_cpf/g, dadosCliente.cnpj_cpf || '')
      .replace(/@contratante_fantasia/g, dadosCliente.fantasia || '')
      .replace(/@contratante_razao_social/g, dadosCliente.razao_social || '')
      .replace(/@cliente_primeiro_nome/g, primeiroNome || '');

    // Atualizando o campo de mensagem no formulário
    mensagemControl.setValue(mensagemOriginal);
  }


  public atualizarMensagem(event: Event): void {
    const selectedMessage = (event.target as HTMLSelectElement).value;

    if (!selectedMessage) {
      this._alertService.warning('Selecione uma mensagem válida.');
      return;
    }

    const whatsArray = this.whatsappForm.get('whats') as FormArray;
    const mensagemControl = whatsArray.at(0).get('mensagem');

    if (mensagemControl) {
      mensagemControl.setValue(selectedMessage);
      this.substituirVariaveisNaMensagem();
    } else {
      this._alertService.error('Erro ao atualizar a mensagem.');
    }
  }


  public abrirModalWhatsapp(telefone: string): void {
    this.substituirVariaveisNaMensagem();
    this.obterMsgs();
    if (telefone) {
      this.telefoneCliente = this.limparNumero(telefone);
      this.inicializarwhatsappForm();
      this.abrirModal = true;
      this._modalService.open(this.whatsappModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    } else {
      this._alertService.warning('Selecione o cliente  para obter o número de telefone.');
    }
  }

  public enviarMensagem(): void {
    if (this.whatsappForm.valid) {
      this.substituirVariaveisNaMensagem();
      this.loadingMin = true;
      this._whatsappService.enviarMensagem(this.whatsappForm.value).subscribe(() => {
        this.loadingMin = false;
        this._alertService.success('Mensagem enviada com sucesso!');
        this.fechaModal();
      }, () => {
        this.loadingMin = false;
        this._alertService.error('Erro ao enviar mensagem.');
      });
    } else {
      this.loadingMin = false;
      this._alertService.warning('Todos oa campos são obrigatórios.');
    }
  }

  public enviarApiWhatsApp(): void {
    this.substituirVariaveisNaMensagem();
    const mensagemControl = this.whatsappForm.get('whats.0.mensagem');
    const telefone = this.limparNumero(this.telefoneCliente);
    const telefoneEncoded = encodeURIComponent(telefone);

    if (mensagemControl && mensagemControl.value) {
      const mensagemEncoded = encodeURIComponent(mensagemControl.value);
      const url = `https://api.whatsapp.com/send?phone=55${telefoneEncoded}&text=${mensagemEncoded}`;

      window.open(url, '_blank');
      this.fechaModal();
    } else {
      this._alertService.warning('Todos oa campos são obrigatórios.');
    }
  }


  public fechaModal() {
    this.abrirModal = false;
    this._modalService.dismissAll();
  }

  private limparNumero(telefone: string): string {
    return telefone.replace(/[\(\)\s\-\.]/g, '');
  }

  public contarCaracteres(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const mensagemControl = this.whatsappForm.get('whats.0.mensagem');

    if (mensagemControl) {
      if (input.value.length > this.maxCaractere) {
        mensagemControl.setValue(input.value.substring(0, this.maxCaractere));
      }
    }
  }
}
