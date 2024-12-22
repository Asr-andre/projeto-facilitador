import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailRetornoModel } from 'src/app/core/models/email.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';
import { EnvioEmailComponent } from './envio-email/envio-email.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent implements OnInit, OnChanges{
  @ViewChild(EnvioEmailComponent) EnvioEmailComponent: EnvioEmailComponent;
  @Output() dadosEnviado: EventEmitter<void> = new EventEmitter<void>();
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean = false;
  public emails: EmailRetornoModel;
  public formEmail: FormGroup;

  constructor(
    private _emailService: EmailService,
    private _formBuilder: FormBuilder,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.inicializarEmailForm();
    this.carregarEmails(this.idCliente);
  }

  ngAfterViewInit() {
    if (this.EnvioEmailComponent) {
      this.EnvioEmailComponent.dadosEnviado.subscribe(() => {
        this.dadosEnviado.emit();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.carregarEmails(this.idCliente);
    }
  }

  public inicializarEmailForm() {
    this.formEmail = this._formBuilder.group({
      id_cliente: [this.idCliente],
      id_empresa: [this.idEmpresa],
      email: ['', [Validators.required, Validators.email]],
      situacao: ['A'],
      origem: ['Cadastro'],
      ativo: ['S'],
      user_login: [this.login]
    });
  }

  public carregarEmails(idCliente: number): void {
    this.loadingMin = true;
    this._emailService.obterEmailPorCliente(idCliente).subscribe((res) => {
      this.emails = res;
      this.loadingMin = false;
    },
      (error) => {
        this._alertService.warning('Erro ao carregar emails:', error);
        this.loadingMin = false;
      }
    );
  }

  public abrirEmailModal(email: string): void {
    this.EnvioEmailComponent.abrirModalEmail(email, this.idCliente, this.idContratante);
  }

  public abriModalEmail(content: TemplateRef<any>): void {
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarEmail(modal: any): void {
    if (this.formEmail.valid) {
      this.loadingMin = true;
      this._emailService.cadastrarEmail(this.formEmail.value).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarEmails(this.idCliente);
          modal.close();
          this._alertService.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Ocorreu um erro ao tentar cadastrar o email.', error);
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }
}
