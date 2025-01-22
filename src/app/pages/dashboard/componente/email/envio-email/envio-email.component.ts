import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailPerfilService } from 'src/app/core/services/cadastro/email.perfil.service';
import { MensagemEmailPerfil, RequisicaoEmailPerfil } from 'src/app/core/models/cadastro/email-perfil.model';
import * as CryptoJS from 'crypto-js';
import { Versao } from 'src/app/core/config/app.config';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrls: ['./envio-email.component.scss']
})
export class EnvioEmailComponent implements OnInit {
  @Output() dadosEnviado = new EventEmitter<void>();
  @ViewChild('emailModal') modalEmailRef: TemplateRef<any>;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public mensages: MensagemEmailPerfil[] = [];
  public destinatarioEmail: string = '';
  public formularioEnvioEmail: FormGroup;
  public assuntoEmail: string = '';
  public mensagemEmail: string = '';
  private arquivoSelecionado: File | null = null;
  public loadingMin: boolean = false;
  public carregandoEnvio: boolean = false;
  public assuntoSelecionado: string = "";

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // Negrito, Itálico, Sublinhado, Tachado
    [{ 'header': 1 }, { 'header': 2 }],               // Cabeçalhos H1 e H2
    [{ 'font': [] }],                                 // Fonte
    [{ 'size': [] }],                                 // Tamanhos de texto
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // Listas ordenadas e não ordenadas
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // Indentação
    [{ 'align': [] }],                                // Alinhamento
    [{ 'color': [] }, { 'background': [] }],          // Cor do texto e fundo
    //['blockquote', 'code-block'],                     // Bloco de citação e código
    //[{ 'script': 'sub' }, { 'script': 'super' }],     // Subscrito e Sobrescrito
    //[{ 'direction': 'rtl' }],                         // Direção do texto (direita para esquerda)
    // ['link', 'image', 'video'],                    // Remover essas funcionalidades
    ['clean']                                         // Limpar formatação
  ];

  public Editor = ClassicEditor;

  constructor(
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    private _emailService: EmailService,
    private _alert: AlertService,
    private _auth: AuthenticationService,
    private _emailPerfil: EmailPerfilService,
  ) { }

  ngOnInit(): void {
    this.inicializarFormularioEnvioEmail();
  }

  public inicializarFormularioEnvioEmail(): void {
    this.formularioEnvioEmail = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [''],
      id_cliente: [''],
      destinatario: [''],
      assunto: ['', Validators.required],
      mensagem: [''],
      anexo: [''],
      user_login: [this.login]
    });
  }

  public obterEmailPerfil() {
    const requisicao: RequisicaoEmailPerfil = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
    }

    if (!requisicao) return;
    this.loadingMin = true;
    this._emailPerfil.obterEmailPerfil(requisicao).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.mensages = res.mensagens;
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um error.", error);
        }
      }
    });
  };

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
      let mensagemOriginal = this.formularioEnvioEmail.get('mensagem')?.value || '';
      const primeiroNome = dadosCliente.nome ? dadosCliente.nome.split(' ')[0] : '';

      // Substituindo as variáveis na mensagem
      mensagemOriginal = mensagemOriginal
        .replace(/@clientes_nome/g, dadosCliente.nome || '')
        .replace(/@clientes_cpf/g, dadosCliente.cnpj_cpf || '')
        .replace(/@contratante_fantasia/g, dadosCliente.fantasia || '')
        .replace(/@contratante_razao_social/g, dadosCliente.razao_social || '')
        .replace(/@cliente_primeiro_nome/g, primeiroNome || '');

      // Atualizando o campo de mensagem no formulário
      this.formularioEnvioEmail.get('mensagem')?.setValue(mensagemOriginal);
    } catch (error) {
      this._alert.error('Ocorreu um erro ao descriptografar os dados do cliente.');
    }
  }

  public abrirModalEmail(email: string, idCliente: number | undefined, idContratante: number | undefined): void {
    this.destinatarioEmail = email;
    this.formularioEnvioEmail.patchValue({
      id_cliente: idCliente,
      id_contratante: idContratante,
      destinatario: email
    });

    this.substituirVariaveisNaMensagem();
    this.obterEmailPerfil();
    this._modalService.open(this.modalEmailRef, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public capturarMsg(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const mensagemId = Number(selectElement.value); // Obtém o ID da mensagem selecionada
    const mensagemSelecionada = this.mensages.find(item => item.id_emailtexto === mensagemId);

    if (mensagemSelecionada) {
      this.formularioEnvioEmail.get('mensagem')?.setValue(mensagemSelecionada.mensagem);
      this.assuntoSelecionado = mensagemSelecionada.descricao;
      this.substituirVariaveisNaMensagem();
    }
  }

  public enviarEmail(): void {
    if (this.formularioEnvioEmail.invalid) {
      this._alert.warning('O campo assunto é mensagem são obrigatório.');
      return;
    }

    this.substituirVariaveisNaMensagem();

    if (this.arquivoSelecionado) {
      this.converterParaBase64(this.arquivoSelecionado).then(base64 => {
        this.formularioEnvioEmail.patchValue({
          anexo: base64
        });
        this.enviarEmailComAnexo();
      }).catch(error => {
        console.error('Erro ao converter arquivo para base64:', error);
      });
    } else {
      this.enviarEmailComAnexo();
    }
  }

  private enviarEmailComAnexo(): void {
    const dadosParaEnvio = { ...this.formularioEnvioEmail.value };
    dadosParaEnvio.assunto = this.assuntoSelecionado

    this.loadingMin = true;
    this._emailService.envioEmailUnitario(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this._alert.success(res.msg);
          this.fechar();
          this.dadosEnviado.emit();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
      error: (error) => {
        this.loadingMin = false;
        this._alert.warning("Voce Não Tem Créditos Suficiente Para Esse Envio, Contate o Administrador do Sistema!", error.msg);
      }
    });
  }

  public fechar() {
    this.resetarCampos();
    this._modalService.dismissAll();
  }

  private resetarCampos() {
    this.formularioEnvioEmail.patchValue({
      assunto: '',
      mensagem: '',
      anexo: ''
    });
  }

  private converterParaBase64(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.readAsDataURL(arquivo);
      leitor.onload = () => {
        const base64String = leitor.result?.toString().split(',')[1];
        resolve(base64String || '');
      };
      leitor.onerror = error => reject(error);
    });
  }

  public aoSelecionarArquivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const arquivo = input.files[0];
      const extensao = this.obterExtensao(arquivo.name);

      if (extensao.toLowerCase() === 'pdf') {
        this.arquivoSelecionado = arquivo;
      } else {
        this._alert.warning('Apenas arquivos PDF são permitidos.');
        input.value = '';
      }
    }
  }

  private obterExtensao(nomeArquivo: string): string {
    return nomeArquivo.split('.').pop()?.toLowerCase() || '';
  }
}
