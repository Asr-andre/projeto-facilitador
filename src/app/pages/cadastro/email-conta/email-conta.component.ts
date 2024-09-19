import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { EmailContaModel } from 'src/app/core/models/cadastro/email.conta.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailContaService } from 'src/app/core/services/cadastro/email.conta.service';

@Component({
  selector: 'app-email-conta',
  templateUrl: './email-conta.component.html',
  styleUrl: './email-conta.component.scss'
})
export class EmailContaComponent implements OnInit {
  public emailConta: EmailContaModel[] = [];
  public emailContaForm: FormGroup;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public loading: boolean = false;
  public loadingMin: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: EmailContaModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<EmailContaModel>>;

  constructor(
    private _emailContaService: EmailContaService,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.obterEmailConta();
    this.inicializarForm();
  }

  public inicializarForm() {
    this.emailContaForm = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      nome_remetente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      porta: ['', Validators.required],
      smtp_host: ['', Validators.required],
      smtp_usuario: ['', Validators.required],
      smtp_senha: ['', Validators.required],
      email_retorno: ['', Validators.required],
      email_envio: ['', Validators.required],
      gera_acionamento: ['', Validators.required],
      ssl: ['N', Validators.required],
      tls: ['N', Validators.required],
      user_login: [this.login, Validators.required]
    });
  }
  public abriModalCadastro(content: TemplateRef<any>): void {
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarEmailConta() {
    if(this.emailContaForm.valid) {
      this.loadingMin = true;

      this._emailContaService.cadastrarEmailConta(this.emailContaForm.value).subscribe((res) => {
        if(res.success === "true") {
          this.loadingMin = false;
          this._alertService.success(res.msg);
          this.obterEmailConta();
          this.fechar();
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
      (error) => {
        this.loadingMin = false;
        this._alertService.error("Ocorreu um erro ao tentar cadastrar.");
      });
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public obterEmailConta() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_perfilemail: 0
    }
    this.loading = true;
    this._emailContaService.obterEmailConta(dados).subscribe((res) => {
      if(res.success === "true") {
        this.emailConta = res.perfil;
        this.filtrar();
        this.atualizarQuantidadeExibida();
        this.loading = false;
      } else {
        this.loading = false;
        this._alertService.error(res.msg);
      }
    });
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.emailConta, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<EmailContaModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.emailConta;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public fechar() {
    this.emailContaForm.reset();
    this._modalService.dismissAll();
  }

  public onChangeRadio(selectedOption: string): void {
    if (selectedOption === 'ssl') {
      this.emailContaForm.get('tls').setValue('N');
    } else if (selectedOption === 'tls') {
      this.emailContaForm.get('ssl').setValue('N');
    }
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
