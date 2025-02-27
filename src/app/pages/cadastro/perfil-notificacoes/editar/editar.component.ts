import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Dados } from 'src/app/core/models/cadastro/perfil.notificacao.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { PerfilNotificacoesService } from 'src/app/core/services/cadastro/perfil.notificacao.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarNComponent implements OnInit {
  public sigla: string = '';
  public loading: boolean = false;
  public login = this._auth.getLogin();
  public idEmpresa = this._auth.getIdEmpresa();
  public perfil: Dados;
  public formNotificacao: FormGroup;
  public qtdcDiasAntes: string = "";

  constructor(
    private _perfilNotificacoes: PerfilNotificacoesService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _funcoes: FuncoesService,
    private _route: Router,
    private _sigla: ActivatedRoute
  ) {
    this._sigla.params.subscribe(params => {
      this.sigla = params['sigla'];
    });
  }

  ngOnInit(): void {
    this.inicializarFormUsuario();
    this.obterNotificacao();
  }

  public inicializarFormUsuario(dado: Dados = {} as Dados) {
    this.formNotificacao = this._fb.group({
      sigla: [this.sigla, Validators.required],
      id_empresa: [this.idEmpresa, Validators.required],
      enabled_payment_created: [dado?.enabled_payment_created || false],
      emailenabledprovider_payment_created: [dado?.emailenabledprovider_payment_created || false],
      smsenabledprovider_payment_created: [dado?.smsenabledprovider_payment_created || false],
      emailenabledcustomer_payment_created: [dado?.emailenabledcustomer_payment_created || false],
      smsenabledcustomer_payment_created: [dado?.smsenabledcustomer_payment_created || false],
      phonecallenabledcustomer_payment_created: [dado?.phonecallenabledcustomer_payment_created || false],
      whatsappenabledcustomer_payment_created: [dado?.whatsappenabledcustomer_payment_created || false],

      enabled_payment_updated: [dado.enabled_payment_updated || false],
      emailenabledprovider_payment_updated: [dado.emailenabledprovider_payment_updated || false],
      smsenabledprovider_payment_updated: [dado.smsenabledprovider_payment_updated || false],
      emailenabledcustomer_payment_updated: [dado.emailenabledcustomer_payment_updated || false],
      smsenabledcustomer_payment_updated: [dado.smsenabledcustomer_payment_updated || false],
      phonecallenabledcustomer_payment_updated: [dado.phonecallenabledcustomer_payment_updated || false],
      whatsappenabledcustomer_payment_updated: [dado.whatsappenabledcustomer_payment_updated || false],

      enabled_payment_duedate_warning: [dado.enabled_payment_duedate_warning || false],
      emailenabledprovider_payment_duedate_warning: [dado.emailenabledprovider_payment_duedate_warning || false],
      smsenabledprovider_payment_duedate_warning: [dado.smsenabledprovider_payment_duedate_warning || false],
      emailenabledcustomer_payment_duedate_warning: [dado.emailenabledcustomer_payment_duedate_warning || false],
      smsenabledcustomer_payment_duedate_warning: [dado.smsenabledcustomer_payment_duedate_warning || false],
      phonecallenabledcustomer_payment_duedate_warning: [dado.phonecallenabledcustomer_payment_duedate_warning || false],
      whatsappenabledcustomer_payment_duedate_warning: [dado.whatsappenabledcustomer_payment_duedate_warning || false],
      scheduleoffset_payment_duedate_warning: [dado.scheduleoffset_payment_duedate_warning || "5"],

      enabled_payment_duedate_warning_2: [dado.enabled_payment_duedate_warning_2 || false],
      emailenabledprovider_payment_duedate_warning_2: [dado.emailenabledprovider_payment_duedate_warning_2 || false],
      smsenabledprovider_payment_duedate_warning_2: [dado.smsenabledprovider_payment_duedate_warning_2 || false],
      emailenabledcustomer_payment_duedate_warning_2: [dado.emailenabledcustomer_payment_duedate_warning_2 || false],
      smsenabledcustomer_payment_duedate_warning_2: [dado.smsenabledcustomer_payment_duedate_warning_2 || false],
      phonecallenabledcustomer_payment_duedate_warning_2: [dado.phonecallenabledcustomer_payment_duedate_warning_2 || false],
      whatsappenabledcustomer_payment_duedate_warning_2: [dado.whatsappenabledcustomer_payment_duedate_warning_2 || false],

      enabled_send_linha_digitavel: [dado.enabled_send_linha_digitavel || false],
      emailenabledprovider_send_linha_digitavel: [dado.emailenabledprovider_send_linha_digitavel || false],
      smsenabledprovider_send_linha_digitavel: [dado.smsenabledprovider_send_linha_digitavel || false],
      emailenabledcustomer_send_linha_digitavel: [dado.emailenabledcustomer_send_linha_digitavel || false],
      smsenabledcustomer_send_linha_digitavel: [dado.smsenabledcustomer_send_linha_digitavel || false],
      phonecallenabledcustomer_send_linha_digitavel: [dado.phonecallenabledcustomer_send_linha_digitavel || false],

      enabled_payment_overdue: [dado.enabled_payment_overdue || false],
      emailenabledprovider_payment_overdue: [dado.emailenabledprovider_payment_overdue || false],
      smsenabledprovider_payment_overdue: [dado.smsenabledprovider_payment_overdue || false],
      emailenabledcustomer_payment_overdue: [dado.emailenabledcustomer_payment_overdue || false],
      smsenabledcustomer_payment_overdue: [dado.smsenabledcustomer_payment_overdue || false],
      phonecallenabledcustomer_payment_overdue: [dado.phonecallenabledcustomer_payment_overdue || false],
      whatsappenabledcustomer_payment_overdue: [dado.whatsappenabledcustomer_payment_overdue || false],

      enabled_payment_overdue_2: [dado.enabled_payment_overdue_2 || false],
      emailenabledprovider_payment_overdue_2: [dado.emailenabledprovider_payment_overdue_2 || false],
      smsenabledprovider_payment_overdue_2: [dado.smsenabledprovider_payment_overdue_2 || false],
      emailenabledcustomer_payment_overdue_2: [dado.emailenabledcustomer_payment_overdue_2 || false],
      smsenabledcustomer_payment_overdue_2: [dado.smsenabledcustomer_payment_overdue_2 || false],
      phonecallenabledcustomer_payment_overdue_2: [dado.phonecallenabledcustomer_payment_overdue_2 || false],
      whatsappenabledcustomer_payment_overdue_2: [dado.whatsappenabledcustomer_payment_overdue_2 || false],
      scheduleoffset_payment_overdue_2: [dado.scheduleoffset_payment_overdue_2 || "1"],

      enabled_payment_received: [dado.enabled_payment_received || false],
      emailenabledprovider_payment_received: [dado.emailenabledprovider_payment_received || false],
      smsenabledprovider_payment_received: [dado.smsenabledprovider_payment_received || false],
      emailenabledcustomer_payment_received: [dado.emailenabledcustomer_payment_received || false],
      smsenabledcustomer_payment_received: [dado.smsenabledcustomer_payment_received || false],
      phonecallenabledcustomer_payment_received: [dado.phonecallenabledcustomer_payment_received || false],
      whatsappenabledcustomer_payment_received: [dado.whatsappenabledcustomer_payment_received || false],
      user_login: [this.login, Validators.required],
    });
  }

  public obterNotificacao() {
    const dados = { sigla: this.sigla, user_login: this.login }

    this.loading = true;
    this._perfilNotificacoes.obterPerfilNotificacaoPorSigla(dados).subscribe((res) => {
      this.perfil = res.dados[0];
      this.inicializarFormUsuario(this.perfil);
      this.loading = false;
    },
      (error) => {
        this._alert.error('Ocorreu um erro ao obter os dados.');
        this.loading = false;
      }
    );
  }

  public editarPerfilNotificacao(): void {
    if (this.formNotificacao.invalid) {
      this._funcoes.camposInvalidos(this.formNotificacao);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    this.loading = true;
    this._perfilNotificacoes.editarPerfilNotificacao(this.formNotificacao.value).pipe(finalize(() => { this.loading = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Erro:', err);
      }
    });
  }

  public desmarcarCriacao() {
    this.formNotificacao.patchValue({
      enabled_payment_created: false,
      emailenabledprovider_payment_created: false,
      smsenabledprovider_payment_created: false,
      emailenabledcustomer_payment_created: false,
      smsenabledcustomer_payment_created: false,
      phonecallenabledcustomer_payment_created: false,
      whatsappenabledcustomer_payment_created: false,
    });
  }

  public desmarcarAvisarAlteracaoValorVcto() {
    this.formNotificacao.patchValue({
      enabled_payment_updated: false,
      emailenabledprovider_payment_updated: false,
      smsenabledprovider_payment_updated: false,
      emailenabledcustomer_payment_updated: false,
      smsenabledcustomer_payment_updated: false,
      phonecallenabledcustomer_payment_updated: false,
      whatsappenabledcustomer_payment_updated: false,
    });
  }

  public desmarcarAvisoDiaVencimento() {
    this.formNotificacao.patchValue({
      enabled_payment_duedate_warning: false,
      emailenabledprovider_payment_duedate_warning: false,
      smsenabledprovider_payment_duedate_warning: false,
      emailenabledcustomer_payment_duedate_warning: false,
      smsenabledcustomer_payment_duedate_warning: false,
      phonecallenabledcustomer_payment_duedate_warning: false,
      whatsappenabledcustomer_payment_duedate_warning: false,
      scheduleoffset_payment_duedate_warning: "5",
    });
  }

  public desmarcarAvisoNoDiaVencimento() {
    this.formNotificacao.patchValue({
      enabled_payment_duedate_warning_2: false,
      emailenabledprovider_payment_duedate_warning_2: false,
      smsenabledprovider_payment_duedate_warning_2: false,
      emailenabledcustomer_payment_duedate_warning_2: false,
      smsenabledcustomer_payment_duedate_warning_2: false,
      phonecallenabledcustomer_payment_duedate_warning_2: false,
      whatsappenabledcustomer_payment_duedate_warning_2: false,
    });
  }

  public desmarcarEnviarLinhaDigitavelVencimento() {
    this.formNotificacao.patchValue({
      enabled_send_linha_digitavel: false,
      emailenabledprovider_send_linha_digitavel: false,
      smsenabledprovider_send_linha_digitavel: false,
      emailenabledcustomer_send_linha_digitavel: false,
      smsenabledcustomer_send_linha_digitavel: false,
      phonecallenabledcustomer_send_linha_digitavel: false,
    });
  }

  public desmarcarAvisoCobrancaVencida() {
    this.formNotificacao.patchValue({
      enabled_payment_overdue: false,
      emailenabledprovider_payment_overdue: false,
      smsenabledprovider_payment_overdue: false,
      emailenabledcustomer_payment_overdue: false,
      smsenabledcustomer_payment_overdue: false,
      phonecallenabledcustomer_payment_overdue: false,
      whatsappenabledcustomer_payment_overdue: false,
    });
  }

  public desmarcarReenviarCobranCaCadaXdias() {
    this.formNotificacao.patchValue({
      enabled_payment_overdue_2: false,
      emailenabledprovider_payment_overdue_2: false,
      smsenabledprovider_payment_overdue_2: false,
      emailenabledcustomer_payment_overdue_2: false,
      smsenabledcustomer_payment_overdue_2: false,
      phonecallenabledcustomer_payment_overdue_2: false,
      whatsappenabledcustomer_payment_overdue_2: false,
      scheduleoffset_payment_overdue_2: "1",
    });
  }

  public desmarcarAvisoDeCobrancaRebedida() {
    this.formNotificacao.patchValue({
      enabled_payment_received: false,
      emailenabledprovider_payment_received: false,
      smsenabledprovider_payment_received: false,
      emailenabledcustomer_payment_received: false,
      smsenabledcustomer_payment_received: false,
      phonecallenabledcustomer_payment_received: false,
      whatsappenabledcustomer_payment_received: false,
    });
  }

  public voltar() {
    this._route.navigate(['../cadastro/perfil-notificacoes']);
  }
}
