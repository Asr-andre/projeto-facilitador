import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { EstadosDoBrasil } from 'src/app/core/helpers/estados.brasil';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { EmailContaModel } from 'src/app/core/models/cadastro/email.conta.model';
import { CepModel } from 'src/app/core/models/cep.model';
import { RetornoModel } from 'src/app/core/models/retorno.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { EmailContaService } from 'src/app/core/services/cadastro/email.conta.service';
import { ConsultaCepService } from 'src/app/core/services/consulta.cep.service';
import { lastValueFrom } from 'rxjs';
import { SmsWhatsAppService } from 'src/app/core/services/cadastro/sms.whatsapp.service';
import { PerfilWhatsappModel } from 'src/app/core/models/cadastro/sms.whatsapp.model';

@Component({
  selector: 'app-contratantes',
  templateUrl: './contratantes.component.html',
  styleUrl: './contratantes.component.scss'
})
export class ContratantesComponent implements OnInit {
  public contratantes: ContratanteModel[];
  public emailConta: EmailContaModel[] = [];
  public msg: PerfilWhatsappModel[] = [];
  public contratante: ContratanteModel[];
  public idPerfilWhatsapp = 1;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public formContratante: FormGroup;
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public cep = new CepModel();
  public estados = EstadosDoBrasil;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: ContratanteModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<ContratanteModel>>;

  constructor(
    private _retornoCep: ConsultaCepService,
    private _contratanteService: ContratanteService,
    private _emailContaService: EmailContaService,
    private _smsWhatsAppService: SmsWhatsAppService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _auth: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.obterContratantes();
    this.inicializarformContratante();
  }

  public inicializarformContratante() {
    this.formContratante = this._formBuilder.group({
      id_contratante: [""],
      id_empresa: [this.idEmpresa],
      cnpj: ["", Validators.required],
      razao_social: ["", Validators.required],
      fantasia: ["", Validators.required],
      cep: [""],
      endereco: [""],
      numero: [""],
      complemento: [""],
      bairro: [""],
      cidade: [""],
      uf: [""],
      telefone: [""],
      celular: [""],
      ativo: ['S'],
      codigo_credor: [""],
      id_formula: [""],
      id_perfilemail: [""],
      id_perfilsms: [""],
      id_perfilwhatsapp: [this.idPerfilWhatsapp],
      id_perfiltextoemail: [""],
      user_login: [this.login],
    });
  }

  public viaCep(cep) {
    if(cep) {
      this._retornoCep.consultarCep(cep).then((cep: CepModel) => {
        this.cep = cep;
      });
    }
  }

  async obterContratantes(): Promise<void> {
    this.loading = true;
    try {
      const res = await lastValueFrom(this._contratanteService.obterContratantePorEmpresa(this.idEmpresa));
      this.contratantes = res.contratantes;
      this.filtrar();
      this.atualizarQuantidadeExibida();
    } catch (error) {
      this._alertService.error('Ocorreu um erro ao obter os contratantes.');
    } finally {
      this.loading = false;
    }
  }

  public obterContratantePorId(dado: number) {
    const dados = {
      id_empresa: this.idEmpresa,
      id_contratante: dado,
      user_login: this.login
    }

    this._contratanteService.obterContratantePorId(dados).subscribe((res) => {
      this.contratante = res.data;
    });
  }

  async acionarPerfilEmail() {
    if (!this.emailConta || this.emailConta.length === 0) {
      await this.obterEmailConta();
    }
  }

  public obterEmailConta() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_perfilemail: 0
    }

    this.loadingMin = true;
    this._emailContaService.obterEmailConta(dados).subscribe((res) => {
      if(res.success === "true") {
        this.emailConta = res.perfil;
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alertService.error(res.msg);
      }
    });
  }

  async acionarPerfilSms() {
    if (!this.msg || this.msg.length === 0) {
      await this.obterMsgs();
    }
  }

  public obterMsgs() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_PerfilWhatsapp: this.idPerfilWhatsapp,
      user_login: this.login
    }

    this.loading = true;
    this._smsWhatsAppService.obterMsg(dados).subscribe((res) => {
      if (res.success === "true") {
        this.msg = res.perfil_whatsapp;
        this.loading = false;
      } else {
        this.loading = false;
        this._alertService.error(res.msg);
      }
    });
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.contratantes, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<ContratanteModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.contratantes;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.inicializarformContratante();
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>): void {
    this.inicializarformContratante();
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarContratante(){
    if (this.formContratante.valid) {
      this.loadingMin = true;
      this._contratanteService.cadastrarContratante(this.formContratante.value).subscribe((res: RetornoModel) => {
        if (res && res.success === "true") {
          this.loadingMin = false;
          this.obterContratantes();
          this._alertService.success(res.msg);
          this._modalService.dismissAll();
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar cadastrar a empresa.");
        }
      );
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public mascararCep(cep: string): string {
    if (cep) {
      return Utils.formatarCEP(cep);
    }
    return cep;
  }

  public mascararNResidencia(numero: string): string {
    if (numero) {
      return Utils.formatarNumeroResidencia(numero);
    }
    return numero;
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public fechar() {
    this.formContratante.reset();
    this._modalService.dismissAll();
  }
}
