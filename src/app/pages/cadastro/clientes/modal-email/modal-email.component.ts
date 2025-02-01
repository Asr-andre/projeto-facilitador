import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailRetornoModel } from 'src/app/core/models/email.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-modal-email',
  templateUrl: './modal-email.component.html',
  styleUrl: './modal-email.component.scss'
})
export class ModalEmailComponent {
  @ViewChild('modalEmail') modalEmail: TemplateRef<any>;

  public idCliente: number | undefined;
  public emails: EmailRetornoModel;
  public loadingMin: boolean = false;
  public telefoneForm: FormGroup;
  public formEmail: FormGroup;

  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();

  constructor(
    private _email: EmailService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.inicializarEmailForm();
  }

  public inicializarEmailForm() {
    this.formEmail = this._fb.group({
      id_cliente: [this.idCliente],
      id_empresa: [this.idEmpresa],
      email: ['', [Validators.required, Validators.email]],
      situacao: ['A'],
      origem: ['Cadastro'],
      ativo: ['S'],
      user_login: [this.login]
    });
  }

  public abrirModalEmail(email: any): void {
    this.idCliente = Number(email.id_cliente);
    this.carregarEmails(this.idCliente);
    this.inicializarEmailForm();
    this._modal.open(this.modalEmail, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public carregarEmails(idCliente: number): void {
    if (!idCliente) return;

    this.loadingMin = true;
    this._email.obterEmailPorCliente(idCliente).subscribe((res) => {
      this.emails = res;
      this.loadingMin = false;
    },
      (error) => {
        this._alert.warning('Erro ao carregar emails:', error);
        this.loadingMin = false;
      }
    );
  }

  public cadastrarEmail(): void {
    if (this.formEmail.invalid) {
      this._funcoes.camposInvalidos(this.formEmail);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if (this.formEmail.valid) {
      this.loadingMin = true;
      this._email.cadastrarEmail(this.formEmail.value).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarEmails(this.idCliente);
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar cadastrar o email.', error);
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formEmail.reset();
    this._modal.dismissAll();
  }
}
