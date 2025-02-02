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
import { catchError, finalize, from, lastValueFrom, Observable, of, switchMap } from 'rxjs';
import { SmsWhatsAppService } from 'src/app/core/services/cadastro/sms.whatsapp.service';
import { PerfilWhatsappModel } from 'src/app/core/models/cadastro/sms.whatsapp.model';
import { SmsService } from 'src/app/core/services/sms.service';
import { PerfilSms } from 'src/app/core/models/sms.model';
import { FormulaService } from 'src/app/core/services/formula.service';
import { Formula } from 'src/app/core/models/formula.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

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
  public perfilSms: PerfilSms[] = [];
  public perfilFormula: Formula[] = [];
  public idPerfilWhatsapp = 1;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public formContratante: FormGroup;
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public cep = new CepModel();
  public estados = EstadosDoBrasil;
  public editar: boolean = false;
  public contratanteSelecionado: ContratanteModel; // Um único objeto
  public titulo: string = '';


  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: ContratanteModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<ContratanteModel>>;

  public perfilEmailCarregado = false;
  public formulaCarregado = false;
  public smsCarregado = false;
  public watsAppCarregado = false;

  constructor(
    private _retornoCep: ConsultaCepService,
    private _contratante: ContratanteService,
    private _emailConta: EmailContaService,
    private _smsWhatsApp: SmsWhatsAppService,
    private _sms: SmsService,
    private _formula: FormulaService,
    private _fb: FormBuilder,
    private _modal: NgbModal,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      await this.obterContratantes();
      await this.inicializarformContratante();
    } catch (error) {
      this._alert.error("Ocorreu um erro ao carregar os dados.");
    } finally {
      this.loading = false;
    }
  }

  gerarPDF(): void {
    // Seleciona o elemento HTML que você quer converter em PDF
    const elemento = document.getElementById('conteudoPDF');

    if (elemento) {
      html2canvas(elemento).then((canvas) => {
        const imagemData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Ajusta a imagem ao tamanho do PDF
        const larguraPDF = pdf.internal.pageSize.getWidth();
        const alturaPDF = (canvas.height * larguraPDF) / canvas.width;

        pdf.addImage(imagemData, 'PNG', 0, 0, larguraPDF, alturaPDF);
        pdf.save('detalhamento_contratante.pdf'); // Nome do arquivo gerado
      });
    } else {
      console.error('Elemento não encontrado!');
    }
  }

  public async inicializarformContratante(dado?: ContratanteModel): Promise<void> {
    this.formContratante = this._fb.group({
      id_contratante: [dado?.id_contratante || ''],
      id_empresa: [dado?.id_empresa || this.idEmpresa],
      cnpj: [dado?.cnpj || '', Validators.required],
      razao_social: [dado?.razao_social || '', Validators.required],
      fantasia: [dado?.fantasia || '', Validators.required],
      chavepix: [dado?.chavepix || ''],
      cep: [dado?.cep || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      telefone: [dado?.telefone || ''],
      celular: [dado?.celular || ''],
      ativo: [dado?.ativo || 'S'],
      codigo_credor: [dado?.codigo_credor || ''],
      id_formula: [dado?.id_formula || '0'],
      id_perfilemail: [dado?.id_perfilemail || '0'],
      id_perfilsms: [dado?.id_perfilsms || '0'],
      id_perfilwhatsapp: [dado?.id_perfilwhatsapp || '0'],
      id_perfiltextoemail: [dado?.id_perfiltextoemail || '0'],
      user_login: [dado?.user_login || this.login, Validators.required],
    });
  }

  public carregarSequencialmente(): void {
    this.carregarPerfilEmail().pipe(
        switchMap(() => this.carregarFormula()),
        switchMap(() => this.carregarSms()),
        switchMap(() => this.carregarWhatsApp()),
        catchError((error) => {
          console.error('Erro ao carregar:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  private carregarPerfilEmail(): Observable<void> {
    if (!this.perfilEmailCarregado) {
      return from(this.obterEmailConta()).pipe(finalize(() => (this.perfilEmailCarregado = true)));
    }
    return of();
  }

  private carregarFormula(): Observable<void> {
    if (!this.formulaCarregado) {
      return from(this.obterPerfilFormula()).pipe(finalize(() => (this.formulaCarregado = true)));
    }
    return of();
  }

  private carregarSms(): Observable<void> {
    if (!this.smsCarregado) {
      return from(this.obterPerfilSms()).pipe(finalize(() => (this.smsCarregado = true)));
    }
    return of();
  }

  private carregarWhatsApp(): Observable<void> {
    if (!this.watsAppCarregado) {
      return from(this.obterMsgs()).pipe(finalize(() => (this.watsAppCarregado = true)));
    }
    return of();
  }

  public viaCep(cep) {
    if (cep) {
      this._retornoCep.consultarCep(cep).then((cep: CepModel) => {
        this.cep = cep;
      });
    }
  }

  async obterContratantes(): Promise<void> {
    this.loading = true;
    try {
      const res = await lastValueFrom(this._contratante.obterContratantePorEmpresa(this.idEmpresa));
      this.contratantes = res.contratantes;
      this.filtrar();
      this.atualizarQuantidadeExibida();
    } catch (error) {
      this._alert.error('Ocorreu um erro ao obter os contratantes.');
    } finally {
      this.loading = false;
    }
  }

  public async obterEmailConta(): Promise<void> {
    const dados = {
      id_empresa: this.idEmpresa,
      id_perfilemail: 0
    };

    this.loadingMin = true;

    return new Promise((resolve, reject) => {
      this._emailConta.obterEmailConta(dados).subscribe((res) => {
        this.loadingMin = false;

        if (res.success === "true") {
          this.emailConta = res.perfil;
          this.perfilEmailCarregado = true;
          resolve();
        } else {
          this._alert.error(res.msg);
          reject();
        }
      }, (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um erro.", error);
        reject();
      });
    });
  }

  public async obterMsgs(): Promise<void> {
    const dados = {
      id_empresa: this.idEmpresa,
      id_PerfilWhatsapp: this.idPerfilWhatsapp,
      user_login: this.login
    };

    this.loadingMin = true;

    return new Promise((resolve, reject) => {
      this._smsWhatsApp.obterMsg(dados).subscribe((res) => {
        this.loadingMin = false;

        if (res.success === "true") {
          this.msg = res.perfil_whatsapp;
          this.watsAppCarregado = true;
          resolve();
        } else {
          this._alert.error(res.msg);
          reject();
        }
      }, (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um erro.", error);
        reject();
      });
    });
  }

  public async obterPerfilSms(): Promise<void> {
    const dados = {
      id_empresa: this.idEmpresa,
      id_perfilsms: 0,
      user_login: this.login
    };

    this.loadingMin = true;

    return new Promise((resolve, reject) => {
      this._sms.listarPerfilSms(dados).subscribe((res) => {
        this.loadingMin = false;

        if (res.success === "true") {
          this.perfilSms = res.perfil_sms;
          this.smsCarregado = true;
          resolve();
        } else {
          this._alert.error(res.msg);
          reject();
        }
      }, (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um erro.", error);
        reject();
      });
    });
  }

  public async obterPerfilFormula(): Promise<void> {
    const dados = {
      id_empresa: this.idEmpresa,
      id_formula: 0,
      user_login: this.login
    };

    this.loadingMin = true;

    return new Promise((resolve, reject) => {
      this._formula.listarFormulas(dados).subscribe((res) => {
        this.loadingMin = false;

        if (res.success === "true") {
          this.perfilFormula = res.formulas;
          this.formulaCarregado = true
          resolve();
        } else {
          this._alert.error(res.msg);
          reject();
        }
      }, (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um erro.", error);
        reject();
      });
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
    this.carregarSequencialmente();
    this.inicializarformContratante();
    this.editar = false;
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public controleBotao() {
    if (this.formContratante.invalid) {
      this._funcoes.camposInvalidos(this.formContratante);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const metodo = this.editar ? this.editarContratante : this.cadastrarContratante;
    metodo.call(this);
  }

  public cadastrarContratante() {
    if (this.formContratante.valid) {
      this.loadingMin = true;

      this._contratante.cadastrarContratante(this.formContratante.value).pipe(
        finalize(() => this.loadingMin = false),
        catchError((error) => {
          this._alert.error("Ocorreu um erro ao tentar cadastrar o contratante.");
          return of(null);
        })
      ).subscribe((res: RetornoModel) => {
        if (res?.success === "true") {
          this._alert.success(res.msg);
          this.obterContratantes();
          this.fechar();
        } else {
          this._alert.warning(res?.msg || 'Erro desconhecido');
        }
      });
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abriModalEditar(content: TemplateRef<any>, dados: ContratanteModel): void {
    this.editar = true;
    this.carregarSequencialmente();
    this.inicializarformContratante(dados);
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalResumo(modalResumo: any, contratanteSelecionado: ContratanteModel): void {
    this.titulo = 'Detalhes do Contratante';
    this.contratanteSelecionado = contratanteSelecionado;
    this._modal.open(modalResumo, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarContratante() {
    this.loadingMin = true;

    this._contratante.editarContratante(this.formContratante.value).pipe(
      finalize(() => this.loadingMin = false),
      catchError((error) => {
        this._alert.error("Ocorreu um erro ao tentar atualizar o contratante.");
        return of(null);
      })
    ).subscribe((res) => {
      if (res?.success) {
        this._alert.success(res.msg);
        this.obterContratantes();
        this.fechar();
      } else {
        this._alert.warning(res?.msg || 'Erro desconhecido');
      }
    });
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

  public mascararTelefone(numero: string): string {
    if (numero) {
      return Utils.formatarTelefone(numero);
    }
    return numero;
  }

  public fechar() {
    this.formContratante.reset();
    this._modal.dismissAll();
  }
}
