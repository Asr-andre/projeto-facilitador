import { Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DetalhamentoModel } from 'src/app/core/models/detalhamento.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Utils } from 'src/app/core/helpers/utils';
import { BaixaPagamentoRequisicaoModel, SimulacaoRequisicaoModel, SimulacaoRetornoModel } from 'src/app/core/models/simulador.padrao.model';
import { SimuladorPadraoService } from 'src/app/core/services/simulador.padrao.sevice';
import { SimuladorPadraoComponent } from './simulador-padrao/simulador-padrao.component';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoTituloModel } from 'src/app/core/models/tipo.titulo.model';
import { TipoTituloService } from 'src/app/core/services/tipo.titulo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { CadastrarTituloRequest } from 'src/app/core/models/cadastro/cliente.model';
import { ModalSituacaoComponent } from './modal-situacao/modal-situacao.component';
import { FuncoesService } from 'src/app/core/services/funcoes.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalhe-da-divida',
  templateUrl: './detalhe-da-divida.component.html',
  styleUrls: ['./detalhe-da-divida.component.scss']
})
export class DetalheDaDividaComponent implements OnInit, OnChanges {
  @ViewChild(SimuladorPadraoComponent) SimuladorPadraoComponent: SimuladorPadraoComponent;
  @ViewChild(ModalSituacaoComponent) ModalSituacaoComponent: ModalSituacaoComponent;

  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  @Input() numeroContrato: string | undefined;
  @Input() numeroDocumento: string | undefined;
  @Output() atualizarAcionamento = new EventEmitter<any>();

  public detalheDevedor: DetalhamentoModel | null = null;
  public loadingMin: boolean = false;
  public loading: boolean =false;
  public selecionarTodos: boolean = true;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public tipoTitulo: TipoTituloModel;
  public formTitulo: FormGroup;

  public filtroSelecionado: string = 'todos';
  public titulosFiltrados: any[] = [];

  @Output() clienteAtualizado = new EventEmitter<void>();

  constructor(
    private _dashboard: DashboardService,
    private _alert: AlertService,
    private _simulador: SimuladorPadraoService,
    private _auth: AuthenticationService,
    private _datePipe: DatePipe,
    private _modal: NgbModal,
    private _tipoTitulo: TipoTituloService,
    private _fb: FormBuilder,
    private _cliente: ClienteService,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.inicializarformTitulo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente || changes.idContratante) {
      this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
    }
  }

  ngAfterViewInit() {
    if (this.SimuladorPadraoComponent) {
      this.SimuladorPadraoComponent.idCliente = this.idCliente;
      this.SimuladorPadraoComponent.idContratante = this.idContratante;
      this.SimuladorPadraoComponent.numeroContrato = this.numeroContrato;
    }
  }

  public inicializarformTitulo(dado?: CadastrarTituloRequest) {
    this.formTitulo = this._fb.group({
      tipo_titulo: [dado?.tipo_titulo || "", Validators.required],
      parcela: [dado?.parcela || "", Validators.required],
      plano: [dado?.plano || "", Validators.required],
      numero_contrato: [dado?.numero_contrato || "", Validators.required],
      numero_documento: [dado?.numero_documento || "", Validators.required],
      vencimento: [dado?.vencimento || "", Validators.required],
      produto: [dado?.produto || "", Validators.required],
      valor: [dado?.valor || "", Validators.required],
      id_contratante: [this.idContratante],
      id_empresa: [this.idEmpresa],
      id_cliente: [this.idCliente],
      user_login: [this.login]
    });
  }

  public abriModalTitulo(content: TemplateRef<any>): void {
    if (!this.idCliente) {
      this._alert.warning('Por favor selecione um cliente!');
      return;
    }

    this.inicializarformTitulo();
    this.obterTipoTitulo();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public obterPrimeiroContratoSelecionado(): string | undefined {
    if (this.detalheDevedor && this.detalheDevedor.parcelas) {
      const parcelaSelecionada = this.detalheDevedor.parcelas.find(parcela => parcela.selecionado);
      return parcelaSelecionada?.numero_contrato;
    }
    return undefined;
  }

  public atualizarDetalhamento(): void {
    this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
    this.clienteAtualizado.emit();
  }

  public obterDetalhamentoPorId(id_cliente: number | undefined, id_contratante: number | undefined): void {
    if (!id_cliente || !id_contratante) return;

    const requisicao = { id_cliente, id_empresa: this.idEmpresa, id_contratante };

    this.loadingMin = true;
    this._dashboard.obterDevedorPorId(requisicao).pipe(finalize(() => { this.loadingMin = false; })).subscribe({
      next: (detalhamento) => {
        if (detalhamento && detalhamento.success) {
          this.atualizarAcionamento.emit();
          this.detalheDevedor = detalhamento;
          this.titulosFiltrados = this.detalheDevedor?.parcelas || [];
          this.numeroContrato = detalhamento.parcelas?.[0]?.numero_contrato;
          if (this.detalheDevedor.parcelas) {
            this.detalheDevedor.parcelas.forEach(parcela => {
              parcela.selecionado = true;
            });
          }
        } else {
          this._alert.warning(detalhamento.msg);
        }
      },
      error: (error) => {
        this._alert.error("Erro ao obter os dados. Tente novamente.", error);
      }
    });
  }

  public obterTipoTitulo() {
    this._tipoTitulo.obterTipoTitulo().subscribe((res) => {
      if (res) {
        this.tipoTitulo = res;
      }
    });
  }

  public calcularTotal(coluna: string): number {
    if (this.titulosFiltrados) {
      return this.titulosFiltrados.reduce((total, prestacao) => {
        if (coluna === 'valorTotalAtualizado') {
          return total + this.calcularTotalAtualizado(prestacao);
        }
        return total + (prestacao[coluna] || 0);

      }, 0);
    }
    return 0;
  }

  public calcularQuantidadeTitulos(): number {
    return this.titulosFiltrados ? this.titulosFiltrados.length : 0;
  }

  public calcularTotalAtualizado(prestacao: any): number {
    return (prestacao.valor || 0) +
      (prestacao.valor_juros || 0) +
      (prestacao.valor_multa || 0) +
      (prestacao.valor_indice || 0) +
      (prestacao.valor_taxa || 0);
  }

  public filtrarTitulos() {
    if (this.filtroSelecionado === 'todos') {
      this.titulosFiltrados = this.detalheDevedor.parcelas;
      this.verificarSelecao();
    } else if (this.filtroSelecionado === 'acordo') {
      this.titulosFiltrados = this.detalheDevedor.parcelas.filter(parcela => parcela.numero_contrato.startsWith('ACD'));
      this.verificarSelecao();
    } else if (this.filtroSelecionado === 'semAcordo') {
      this.titulosFiltrados = this.detalheDevedor.parcelas.filter(parcela => !parcela.numero_contrato.startsWith('ACD'));
      this.verificarSelecao();
    }
  }

  public verificarSelecao() {
    if (this.titulosFiltrados && this.titulosFiltrados.length) {
      // Verifica se todos os itens filtrados estão selecionados
      this.selecionarTodos = this.titulosFiltrados.every(parcela => parcela.selecionado);
    } else {
      // Se não houver títulos filtrados, não marca "Selecionar Todos"
      this.selecionarTodos = false;
    }
  }

  // Marca ou desmarca todos os itens visíveis de acordo com o filtro
  public marcaTodos(event: any) {
    this.selecionarTodos = event.target.checked;

    // Marca ou desmarca todos os itens filtrados
    if (this.titulosFiltrados && this.titulosFiltrados.length) {
      this.titulosFiltrados.forEach(parcela => {
        parcela.selecionado = this.selecionarTodos;
      });
    }

    this.verificarSelecao();
  }

  public simularNegociacao(): void {
    if (!this.idCliente) {
      this._alert.warning('Por favor selecione um cliente!');
      return;
    }

    if (!this.idCliente || !this.idContratante || !this.detalheDevedor) {
      return;
    }

    const titulosSelecionados = this.titulosFiltrados
      .filter(parcela => parcela.selecionado)
      .map(parcela => parcela.id_titulo)
      .join(',');

    const requisicao: SimulacaoRequisicaoModel = {
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante,
      id_cliente: this.idCliente,
      user_login: this.login,
      data_atualizacao: new Date().toLocaleDateString('pt-BR'),
      titulos: titulosSelecionados
    };

    this._simulador.simularNegociacao(requisicao).subscribe(
      (retorno: SimulacaoRetornoModel) => {
        this.SimuladorPadraoComponent.abrirModalSimulado(retorno);
      },
      (error) => {
        this._alert.error('Erro ao simular negociação.');
      }
    );
  }

  public retiradas(): void {
    if (!this.detalheDevedor?.parcelas) {
      this._alert.warning('Nenhum título selecionado para retirada.');
      return;
    }

    const titulos = this.detalheDevedor.parcelas
      .filter(parcela => parcela.selecionado) // Apenas títulos selecionados
      .map(titulo => ({
        id_titulo: titulo.id_titulo,
        valor: titulo.valor,
        valor_multa: titulo.valor_multa = 0,
        valor_indice: titulo.valor_indice = 0,
        valor_juros: titulo.valor_juros = 0,
        valor_taxa: titulo.valor_taxa = 0,
        valor_atualizado: titulo.valor
      }));

    if (titulos.length === 0) {
      this._alert.warning('Nenhum título selecionado para retirada.');
      return;
    }

    this._alert.retirada().then(confirmarRetirada => {
      if (!confirmarRetirada) {
        return;
      }

      const dataAtual = new Date();
      const dataNegociacao = this._datePipe.transform(dataAtual, 'dd/MM/yyyy')!;
      const dadosParaEnvio: BaixaPagamentoRequisicaoModel = {
        id_empresa: this.idEmpresa,
        id_contratante: this.idContratante,
        id_cliente: this.idCliente,
        id_acordo: this.numeroDocumento,
        data_negociacao: dataNegociacao,
        tipo_baixa: 'R',
        user_login: this.login,
        titulos: titulos
      };

      this._simulador.baixarTitulosPago(dadosParaEnvio).subscribe(
        (res) => {
          this._alert.success(res.msg);
          this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
        },
        error => {
          this._alert.error('Ocorreu um erro ao realizar a retirada.');
        }
      );
    });
  }

  public cadastrarTitulo(): void {
    if (!this.formTitulo.valid) {
      this._funcoes.camposInvalidos(this.formTitulo);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if (!this.idCliente || !this.idEmpresa || !this.idContratante) {
      this._alert.warning('Os dados necessários não estão disponíveis.');
      return;
    }

    const dadosTitulo = {
      ...this.formTitulo.value,
      id_empresa: this.idEmpresa,
      id_cliente: this.idCliente,
      id_contratante: this.idContratante,
      vencimento: this._datePipe.transform(this.formTitulo.value.vencimento, 'dd/MM/yyyy') || ''
    };

    this.loadingMin = true;
    this._cliente.cadastrarTitulos(dadosTitulo).pipe(finalize(() => { this.loadingMin = false; })).subscribe({
      next: (res) => {
        if (res.success) {
          this._alert.success(res.msg);
          this.atualizarDetalhamento();
          this.fechar();
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (error) => {
        this._alert.error("Atenção Título Já Existente, Verifique os Campos Chaves!!!", error);
      }
    });
  }

  public verificarValorNegativo(campo: string) {
    const valor = this.formTitulo.get(campo)?.value;

    if (valor <= 0) {
      this.formTitulo.get(campo)?.setValue(0);
    }
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alert.copiado();
  }

  public tipoPessoa(dado: string): string {
    if(!dado) return '';

    return dado.length === 11 ? '[ PF ]' : dado.length === 14 ? '[ PJ ];' : '';
  }

  public abriModalSituacao(): void {
    if (!this.idCliente) {
      this._alert.warning('Por favor selecione um cliente antes de atualizar a situação');
      return;
    }
    this.ModalSituacaoComponent.abriModalSituacao();
  }

  public fechar() {
    this._modal.dismissAll();
    this.formTitulo.reset();
  }
}
