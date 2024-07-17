import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvioEmailModel } from 'src/app/core/models/email.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrls: ['./envio-email.component.scss']
})
export class EnvioEmailComponent implements OnInit {
  @ViewChild('emailModal') modalEmailRef: TemplateRef<any>;
  public destinatarioEmail: string = '';
  public formularioEnvioEmail: FormGroup;
  public assuntoEmail: string = '';
  public mensagemEmail: string = '';
  private arquivoSelecionado: File | null = null;
  public carregandoEnvio: boolean = false;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private alertService: AlertService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.inicializarFormularioEnvioEmail();
  }

  public inicializarFormularioEnvioEmail(): void {
    this.formularioEnvioEmail = this.formBuilder.group({
      id_empresa: [Number(this.authService.getIdEmpresa())],
      id_contratante: [''],
      id_cliente: [''],
      destinatario: [''],
      assunto: ['', Validators.required],
      mensagem: [''],
      anexo: [''],
    });
  }

  public abrirModalEmail(email: string, idCliente: number | undefined, idContratante: number | undefined): void {
    this.destinatarioEmail = email;
    this.formularioEnvioEmail.patchValue({
      id_cliente: idCliente,
      id_contratante: idContratante,
      destinatario: email
    });
    this.modalService.open(this.modalEmailRef, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public enviarEmail(): void {
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
    if (this.formularioEnvioEmail.value) {
      this.emailService.envioEmailUnitario(this.formularioEnvioEmail.value).subscribe((res) => {
        if (res.success === 'true') {
          console.log(`Envio de e-mail bem-sucedido: ${res}`);
          this.modalService.dismissAll();
          this.alertService.success(res.msg);
          this.formularioEnvioEmail.patchValue({
            assunto: '',
            mensagem: '',
            anexo: ''
          });

        } else {
          this.alertService.warning(res.msg);
        }
      })
    } else {
      this.alertService.warning('O campo Assunto é obrigatório.');
    }
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
        this.alertService.warning('Apenas arquivos PDF são permitidos.');
        input.value = '';
      }
    }
  }

  private obterExtensao(nomeArquivo: string): string {
    return nomeArquivo.split('.').pop()?.toLowerCase() || '';
  }

}
