import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilSms } from 'src/app/core/models/sms.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SmsService } from 'src/app/core/services/sms.service';
import * as CryptoJS from 'crypto-js';
import { Versao } from 'src/app/core/config/app.config';

@Component({
  selector: 'app-envio-sms',
  templateUrl: './envio-sms.component.html',
  styleUrl: './envio-sms.component.scss'
})
export class EnvioSmsComponent implements OnInit {
  @Output() dadosEnviado = new EventEmitter<void>();
  @ViewChild('smsModal') modalEmailRef: TemplateRef<any>;
  public foneDestinatario: string = '';
  public sms: PerfilSms [] = [];
  public formEnvioSms: FormGroup;
  public maxCaractere: number = 160;
  public mensagem: string = '';
  public loadingMin: boolean = false;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();

  constructor(
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _sms: SmsService,
    private _alert: AlertService,
    private _auth: AuthenticationService,
  ) { }


  ngOnInit(): void {
    this.inicializarFormSms();
  }

  public inicializarFormSms() {
    this.formEnvioSms = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [''],
      id_cliente: [''],
      fone: [''],
      mensagem: ['', Validators.required],
      user_login: [this.login]
    });
  }

  public obterPerfilSms() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_perfilsms: 0,
      user_login: this.login
    }

    this.loadingMin = true;
    this._sms.listarPerfilSms(dados).subscribe((res) => {
      if(res.success === "true") {
        this.sms = res.perfil_sms;
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alert.error(res.msg);
      }
      (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um error.", error);
      }
    });
  }

  public substituirVariaveisNaMensagem(): void {
    // Chave de criptografia usada no armazenamento
    const chaveSecreta = Versao.chaveSecreta;

    // Obtendo os dados criptografados do localStorage
    const dadosCriptografados = sessionStorage.getItem('dadosCliente');

    if (!dadosCriptografados) {
        this._alert.warning('Os dados do cliente não foram encontrados no localStorage.');
        return;
    }

    try {
        // Descriptografando os dados
        const bytes = CryptoJS.AES.decrypt(dadosCriptografados, chaveSecreta);
        const dadosCliente = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // Verificando se os dados existem
        if (!dadosCliente || Object.keys(dadosCliente).length === 0) {
            this._alert.warning('Os dados do cliente não foram encontrados no localStorage.');
            return;
        }

        // Obtendo a mensagem original
        let mensagemOriginal = this.formEnvioSms.get('mensagem')?.value || '';
        const primeiroNome = dadosCliente.nome ? dadosCliente.nome.split(' ')[0] : '';

        // Substituindo as variáveis na mensagem
        mensagemOriginal = mensagemOriginal
            .replace(/@clientes_nome/g, dadosCliente.nome || '')
            .replace(/@clientes_cpf/g, dadosCliente.cnpj_cpf || '')
            .replace(/@contratante_fantasia/g, dadosCliente.fantasia || '')
            .replace(/@contratante_razao_social/g, dadosCliente.razao_social || '')
            .replace(/@cliente_primeiro_nome/g, primeiroNome || '');

        // Atualizando o campo de mensagem no formulário
        this.formEnvioSms.get('mensagem')?.setValue(mensagemOriginal);
    } catch (error) {
        this._alert.error('Ocorreu um erro ao descriptografar os dados do cliente.');
    }
}

  public abrirModalSms(fone: string, idCliente: number | undefined, idContratante: number | undefined): void {
    this.obterPerfilSms();
    this.foneDestinatario = fone;
    this.formEnvioSms.patchValue({
      id_cliente: idCliente,
      id_contratante: idContratante,
      fone: fone
    });
    this.resetarCampos();
    this._modal.open(this.modalEmailRef, { size: 'ms', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public capturarMsg(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const mensagemId = Number(selectElement.value);
    const mensagemSelecionada = this.sms.find(item => item.id_perfilsms === mensagemId);

    if (mensagemSelecionada) {
      this.formEnvioSms.get('mensagem')?.setValue(mensagemSelecionada.mensagem);
      this.substituirVariaveisNaMensagem();
    }
  }

  public enviarSms(): void {
    if (this.formEnvioSms.valid) {
      this.loadingMin = true;
      this.substituirVariaveisNaMensagem();
      const mensagemSemQuebraLinha = this.formEnvioSms.get('mensagem')?.value.replace(/\n/g, '');
      this.formEnvioSms.patchValue({ mensagem: mensagemSemQuebraLinha });

      this._sms.envioSmsUnitario(this.formEnvioSms.value).subscribe((res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.dadosEnviado.emit();
          this._modal.dismissAll();
          this.resetarCampos();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      }, error => {
        this.loadingMin = false;
        this._alert.error('Erro ao enviar SMS. Tente novamente.');
      });
    } else {
      this.loadingMin = false;
      this._alert.warning('Digite uma mensagem para enviar');
    }
  }

  public contarCaracteres(): void {
    if (this.mensagem.length > this.maxCaractere) {
      this.mensagem = this.mensagem.substring(0, this.maxCaractere);
      this.formEnvioSms.get('mensagem')?.setValue(this.mensagem);
    }
  }

  private resetarCampos() {
    this.formEnvioSms.patchValue({
      mensagem: '',
    });
  }

  public fechar() {
    this.resetarCampos();
    this._modal.dismissAll();
  }
}
