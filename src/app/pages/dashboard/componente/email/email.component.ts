import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailRetornoModel } from 'src/app/core/models/email.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent implements OnInit, OnChanges{
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public loading: boolean = false;
  public emails: EmailRetornoModel;
  public formEmail: FormGroup;

  constructor(
    private _emailService: EmailService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.inicializarEmailForm();
    this.carregarEmails(this.idCliente);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.carregarEmails(this.idCliente);
    }
  }

  public inicializarEmailForm() {
    this.formEmail = this._formBuilder.group({
      id_cliente: [this.idCliente],
      email: ['', [Validators.required, Validators.email]],
      situacao: [''],
      origem: ['Cadastro'],
      ativo: ['S'],
      user_login: [this._authenticationService.getLogin()]
    });
  }

  public carregarEmails(idCliente: number): void {
    this.loading = true;
    this._emailService.obterEmailPorCliente(idCliente).subscribe((res) => {
      this.emails = res;
      this.loading = false;
    },
      (error) => {
        console.error('Erro ao carregar emails:', error);
        this.loading = false;
      }
    );
  }

  public abriModalEmail(content: TemplateRef<any>): void {
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  public cadastrarEmail(modal: any): void {
    if (this.formEmail.valid) {
      this.loading = true;
      this._emailService.cadastrarEmail(this.formEmail.value).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarEmails(this.idCliente);
          modal.close();
          this._alertService.success(res.msg);
          this.loading = false;
        } else {
          this.loading = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loading = false;
          this._alertService.error('Ocorreu um erro ao tentar cadastrar o email.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }
}
