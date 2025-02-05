import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, catchError, debounceTime, finalize, from, of, switchMap } from 'rxjs';
import { Utils } from 'src/app/core/helpers/utils';
import { AcionamentoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/acionamento.model';
import { AcaoCobrancaModel, RequisicaoAcaoCobrancaModel } from 'src/app/core/models/acoes.cobranca.model';
import { DevedorModel, RespostaDevedorModel } from 'src/app/core/models/devedor.model';
import { FilaModel, FilaRequisicaoModel } from 'src/app/core/models/fila.model';
import { AcaoCobrancaService } from 'src/app/core/services/acao.cobranca.service';
import { AcionamentoService } from 'src/app/core/services/acionamento.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { FilaService } from 'src/app/core/services/fila.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: "app-acionamento",
  templateUrl: "./acionamento.component.html",
  styleUrl: "./acionamento.component.scss",
})
export class AcionamentoComponent implements OnChanges, OnInit {
  @ViewChild("acaoDeCobrancaModal") modalEmailRef: TemplateRef<any>;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  @Input() idFila: number | undefined;
  @Output() clienteAcionado = new EventEmitter<void>();
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public usuario: string = this._auth.getLogin();
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public acionamentos: AcionamentoModel[] = [];
  public acoesCobranca: AcaoCobrancaModel[] = [];
  public formAcionamento: FormGroup;
  public conteudoCompleto: string = "";
  public textoVisivel: string = ''; // Armazena o texto atualmente visível
  public loadingTabela: boolean = false;
  public loadingAgenda: boolean = false;
  public loadinAcaoCobanca: boolean = false;
  public agenda: DevedorModel[] = [];
  public filas: FilaModel[] = [];

  public filaCarregado: boolean = false;
  public acaoCobrancaCarregado: boolean = false;

  private updateSubject: Subject<void> = new Subject<void>();

  constructor(
    private _alert: AlertService,
    private _modal: NgbModal,
    private _auth: AuthenticationService,
    private _acionamento: AcionamentoService,
    private _acaoCobranca: AcaoCobrancaService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    private _excel: ExcelService,
    private _dashboard: DashboardService,
    private _funcoes: FuncoesService,
    private _fila: FilaService,
  ) { }

  ngOnInit(): void {
    this.inicializarformAcionamentos();

    this.formAcionamento.get('id_acao')?.valueChanges.subscribe((idAcaoSelecionada) => {
      const acaoSelecionada = this.acoesCobranca.find(acao => acao.id_acao === Number(idAcaoSelecionada));

      if (acaoSelecionada && acaoSelecionada.data_prox_acio) {
        this.formAcionamento.get('data_prox_acio')?.enable(); // Habilita o campo

        const dataFormatada = this._datePipe.transform(acaoSelecionada.data_prox_acio, 'dd/MM/yyyy HH:mm');
        this.formAcionamento.get('data_prox_acio')?.setValue(dataFormatada); // Atualiza o valor
      } else {
        this.formAcionamento.get('data_prox_acio')?.disable(); // Desabilita o campo
        this.formAcionamento.get('data_prox_acio')?.setValue(null); // Limpa o valor
      }
    });

    this.updateSubject.pipe(debounceTime(900)).subscribe(() => this.listarAcionamentos());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["idCliente"] || changes["idContratante"]) {
      this.updateSubject.next();
    }
  }

  public inicializarformAcionamentos() {
    this.formAcionamento = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [this.idContratante],
      id_cliente: [this.idCliente],
      id_acao: ['', Validators.required],
      id_fila: [this.idFila],
      data_prox_acio: [{ value: null, disabled: true }], // Inicializa desabilitado
      id_usuario: [this.idUsuario],
      mensagem: ["", Validators.required],
      user_login: [this.usuario],
    });
  }

  public carregarSequencialmente(): void {
    this.carregaAcaoCobranca().pipe(
      switchMap(() => this.carregaFila()),
      catchError((error) => {
        console.error('Erro ao carregar:', error);
        return of(null);
      })
    )
      .subscribe();
  }

  private carregaFila(): Observable<void> {
    if (!this.filaCarregado) {
      return from(this.obterFilas()).pipe(finalize(() => (this.filaCarregado = true)));
    }
    return of();
  }

  private carregaAcaoCobranca(): Observable<void> {
    if (!this.acaoCobrancaCarregado) {
      return from(this.listarAcoesCobranca()).pipe(finalize(() => (this.acaoCobrancaCarregado = true)));
    }
    return of();
  }

  public obterFilas(): Promise<void> {
    const requisicao: FilaRequisicaoModel = {
      id_empresa: this.idEmpresa,
      user_login: this.usuario,
      id_usuario: this.idUsuario,
    };

    this.loadinAcaoCobanca = true;
    return new Promise((resolve, reject) => {
      this._fila.obterFilas(requisicao).subscribe(
        (res) => {
          if (res.success) {
            this.loadinAcaoCobanca = false;
            this.filas = res.filas;
            this.filaCarregado = true;
            resolve();
          } else {
            this.loadinAcaoCobanca = false;
            this._alert.error(res.msg);
            reject(res.msg);
          }
        },
        (error) => {
          this.loadinAcaoCobanca = false;
          this._alert.error("Ocorreu um erro.");
          reject(error);
        }
      );
    });
  }


  public listarAcionamentos(): void {
    if (this.idCliente && this.idContratante) {
      const requisicao: RequisicaoAcionamentoModel = {
        id_empresa: this.idEmpresa,
        id_contratante: this.idContratante,
        id_cliente: this.idCliente,
      };

      this.loadingTabela = true;
      this._acionamento.listarAcionamentos(requisicao).subscribe((res) => {
        this.loadingTabela = false;
        if (res.success) {
          this.loadingTabela = false;
          this.acionamentos = res.acionamentos;
        } else {
          this.loadingTabela = false;
          this._alert.error(res.msg);
        }
      },
        (error) => {
          this.loadingTabela = false;
          this._alert.error("Erro ao listar acionamentos");
        }
      );
    }
  }

  public listarAcoesCobranca(): Promise<void> {
    if (!this.idEmpresa) return Promise.resolve();

    const requisicao: RequisicaoAcaoCobrancaModel = {
      id_empresa: this.idEmpresa,
    };
    this.loadinAcaoCobanca = true;
    return new Promise((resolve, reject) => {
      this._acaoCobranca.listarAcoesCobranca(requisicao).subscribe(
        (res) => {
          if (res.success) {
            this.loadinAcaoCobanca = false;
            this.acaoCobrancaCarregado = true;
            this.acoesCobranca = res.contratantes;
            resolve();
          } else {
            this.loadinAcaoCobanca = false;
            this._alert.error(res.msg);
            reject(res.msg);
          }
        },
        (error) => {
          this.loadinAcaoCobanca = false;
          this._alert.error("Erro ao listar ações de cobrança");
          reject(error);
        }
      );
    });
  }

  public obterAgenda(): void {
    const requisicao = {
      cnpj_cpf: '',
      id_empresa: this.idEmpresa,
      id_fila: 1,
      id_usuario: this.idUsuario,
      mostrar_cliente_sem_dividas: 'N',
      nome: ''
    }

    this.loadingAgenda = true;
    this._dashboard.obterDevedores(requisicao).subscribe((res: RespostaDevedorModel) => {
      if (res && res.success === "true") {
        this.agenda = res.clientes;
        this.loadingAgenda = false;
      } else {
        this.loadingAgenda = false;
        this._alert.warning(res.msg);
      }
    });
  }

  public abriModalagenda(content: TemplateRef<any>): void {
    this.obterAgenda();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public exportExcel() {
    if (!this.acionamentos) return;
    this._excel.exportAsExcelFile(this.acionamentos, 'exportacaoAcionamentoAnalitico');
  }

  public abriracaoDeCobrancaModal(modal): void {
    if (!this.idCliente) {
      this._alert.warning('Por favor selecione um cliente!');
      return;
    }

    this.formAcionamento.patchValue({
      id_cliente: this.idCliente,
      id_contratante: this.idContratante,
      id_empresa: this.idEmpresa,
      id_usuario: this.idUsuario,
      id_fila: this.idFila,
      mensagem: "",
      user_login: this.usuario,
    });

    this.carregarSequencialmente();
    this._modal.open(this.modalEmailRef, { size: "lg", ariaLabelledBy: "modal-basic-title", backdrop: "static", keyboard: false, });
  }

  public enviarAcionamento(): void {
    if (this.formAcionamento.invalid) {
      this._funcoes.camposInvalidos(this.formAcionamento);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const acionamento = { ...this.formAcionamento.value };

    if (acionamento.data_prox_acio) {
      acionamento.data_prox_acio = this._datePipe.transform(acionamento.data_prox_acio, 'dd/MM/yyyy HH:mm:ss');
    } else {
      acionamento.data_prox_acio = '';
    }

    this.loadinAcaoCobanca = true;
    this._acionamento.inserirAcionamento(acionamento).subscribe((res) => {
      this.loadinAcaoCobanca = false;
      if (res.success) {
        this.loadinAcaoCobanca = false;
        this._alert.success(res.msg);
        this.listarAcionamentos();
        this.clienteAcionado.emit();
        this.fechar();
      } else {
        this.loadinAcaoCobanca = false;
        this._alert.error(res.msg);
      }
    },
      (error) => {
        this.loadinAcaoCobanca = false;
        this._alert.error("Erro ao inserir acionamento");
      }
    );
  }

  public mostraConteudoTruncado(texto: string, limite: number): string {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }

  public exibirConteudoCompleto(acionamento: any, campo: string): void {
    acionamento[campo + '_visivel'] = acionamento[campo]; // Mostra o texto completo
  }

  public ocultarConteudoTruncado(acionamento: any, campo: string, limite: number): void {
    acionamento[campo + '_visivel'] = this.mostraConteudoTruncado(acionamento[campo], limite); // Volta ao texto truncado
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alert.copiado();
  }

  public fechar() {
    this.formAcionamento.reset();
    this._modal.dismissAll();
  }
}
