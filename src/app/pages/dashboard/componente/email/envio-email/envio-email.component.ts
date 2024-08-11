import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrls: ['./envio-email.component.scss']
})
export class EnvioEmailComponent implements OnInit {
  @Output() dadosEnviado = new EventEmitter<void>();
  @ViewChild('emailModal') modalEmailRef: TemplateRef<any>;
  public destinatarioEmail: string = '';
  public formularioEnvioEmail: FormGroup;
  public assuntoEmail: string = '';
  public mensagemEmail: string = '';
  private arquivoSelecionado: File | null = null;
  public carregandoEnvio: boolean = false;

  constructor(
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _emailService: EmailService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.inicializarFormularioEnvioEmail();
  }

  public inicializarFormularioEnvioEmail(): void {
    this.formularioEnvioEmail = this._formBuilder.group({
      id_empresa: [Number(this._authService.getIdEmpresa())],
      id_contratante: [''],
      id_cliente: [''],
      destinatario: [''],
      assunto: ['', Validators.required],
      mensagem: [''],
      anexo: [''],
      user_login: [this._authService.getLogin()]
    });
  }

  public abrirModalEmail(email: string, idCliente: number | undefined, idContratante: number | undefined): void {
    this.destinatarioEmail = email;
    this.formularioEnvioEmail.patchValue({
      id_cliente: idCliente,
      id_contratante: idContratante,
      destinatario: email
    });
    this._modalService.open(this.modalEmailRef, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public enviarEmail(): void {
    if (this.formularioEnvioEmail.invalid) {
      this._alertService.warning('O campo assunto é mensagem são obrigatório.');
      return;
    }

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
    this._emailService.envioEmailUnitario(this.formularioEnvioEmail.value).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this._modalService.dismissAll();
          this._alertService.success(res.msg);
          this.resetarCampos();
          this.dadosEnviado.emit();
        } else {
          this.resetarCampos();
          this._alertService.warning(res.msg);
        }
      },
      error: (error) => {
        this._alertService.warning("Voce Não Tem Créditos Suficiente Para Esse Envio, Contate o Administrador do Sistema!", error.msg);
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
        this._alertService.warning('Apenas arquivos PDF são permitidos.');
        input.value = '';
      }
    }
  }

  private obterExtensao(nomeArquivo: string): string {
    return nomeArquivo.split('.').pop()?.toLowerCase() || '';
  }
}
