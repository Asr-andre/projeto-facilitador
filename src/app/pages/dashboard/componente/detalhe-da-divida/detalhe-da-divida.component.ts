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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteTitulosModel } from 'src/app/core/models/cadastro/cliente.titulos.model';

@Component({
  selector: 'app-detalhe-da-divida',
  templateUrl: './detalhe-da-divida.component.html',
  styleUrls: ['./detalhe-da-divida.component.scss']
})
export class DetalheDaDividaComponent implements OnInit, OnChanges {
  @ViewChild(SimuladorPadraoComponent) SimuladorPadraoComponent: SimuladorPadraoComponent;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  @Input() numeroContrato: string | undefined;
  @Input() numeroDocumento: string | undefined;
  public detalhamentoSelecionado: DetalhamentoModel | null = null;
  public loadingMin: boolean = false;
  public selecionarTodos: boolean = true;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login = this._authService.getLogin();
  public editar: boolean = false;
  public tipoTitulo: TipoTituloModel;
  public formTitulo: FormGroup;

  public parcelasGeradas: any[] = [];


  public filtroSelecionado: string = 'todos';
  public titulosFiltrados: any[] = [];

  @Output() clienteAtualizado = new EventEmitter<void>();

  constructor(
    private _dashboard: DashboardService,
    private _alertService: AlertService,
    private _simuladorPadraoService: SimuladorPadraoService,
    private _authService: AuthenticationService,
    private _simuladorService: SimuladorPadraoService,
    private _datePipe: DatePipe,
    private _modalService: NgbModal,
    private _tipoTituloService: TipoTituloService,
    private _formBuilder: FormBuilder,
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

  public inicializarformTitulo(dado?: ClienteTitulosModel) {
    this.formTitulo = this._formBuilder.group({
      tipo_titulo: [dado?.tipo_titulo],
      parcela: [dado?.parcela || ""],
      plano: [dado?.plano || ""],
      numero_contrato: [dado?.numero_contrato || ""],
      numero_documento: [dado?.numero_documento || ""],
      vencimento: [dado?.vencimento || ""],
      tipo_produto: [dado?.tipo_produto || ""],
      valor: [dado?.valor || ""],
      id_contratante: [this.idContratante],
      id_empresa: [this.idEmpresa],
      id_cliente: [this.idCliente],
      user_login: [this.login]
    });
  }

  public abriModalTitulo(content: TemplateRef<any>): void {
    this.editar = false;
    this.obterTipoTitulo();
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public obterPrimeiroContratoSelecionado(): string | undefined {
    const parcelaSelecionada = this.detalhamentoSelecionado?.parcelas.find(parcela => parcela.selecionado);
    return parcelaSelecionada?.numero_contrato;
  }


  public atualizarDetalhamento(): void {
    this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
    this.clienteAtualizado.emit();
  }

  public obterDetalhamentoPorId(id_cliente: number | undefined, id_contratante: number | undefined): void {
    if (id_cliente == null || id_contratante == null) {
      return;
    }

    this._alertService.timer(true);
    this._dashboard.obterDevedorPorId(id_cliente, id_contratante).subscribe(
      (detalhamento) => {
        if (detalhamento && detalhamento.success) {
          this.detalhamentoSelecionado = detalhamento;
          this.titulosFiltrados = this.detalhamentoSelecionado?.parcelas || [];
          this.numeroContrato = detalhamento.parcelas?.[0]?.numero_contrato;
          if (this.detalhamentoSelecionado.parcelas) {
            this.detalhamentoSelecionado.parcelas.forEach(parcela => {
              parcela.selecionado = true;
              this._alertService.timer(false);
            });
          }
          this._alertService.timer(false);
        }
      },
      (error) => {
        this._alertService.error('Não foi possível pesquisar o cliente!');
        this._alertService.timer(false);
      }
    );
  }

  public obterTipoTitulo() {
    this._tipoTituloService.obterTipoTitulo().subscribe((res) => {
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
      (prestacao.valor_taxa || 0);
  }

  public formatarCPF(cpf: string): string {
    if (!cpf) return '';

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public marcaTodos(event: any) {
    this.selecionarTodos = event.target.checked;
    if (this.titulosFiltrados && this.titulosFiltrados) {
      this.titulosFiltrados.forEach(parcela => {
        parcela.selecionado = this.selecionarTodos;
      });
    }
    this.verificarSelecao();
  }

  public verificarSelecao() {
    if (this.detalhamentoSelecionado && this.detalhamentoSelecionado.parcelas) {
      this.selecionarTodos = this.detalhamentoSelecionado.parcelas.every(parcela => parcela.selecionado);
    }
  }

  public simularNegociacao(): void {
    if (!this.idCliente || !this.idContratante || !this.detalhamentoSelecionado) {
      return;
    }

    const titulosSelecionados = this.detalhamentoSelecionado.parcelas
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

    this._simuladorPadraoService.simularNegociacao(requisicao).subscribe(
      (retorno: SimulacaoRetornoModel) => {
        this.SimuladorPadraoComponent.abrirModalSimulado(retorno);
      },
      (error) => {
        this._alertService.error('Erro ao simular negociação.');
      }
    );
  }

  public retiradas(): void {
    if (!this.detalhamentoSelecionado?.parcelas) {
      this._alertService.error('Nenhum título selecionado para retirada.');
      return;
    }

    const titulos = this.detalhamentoSelecionado.parcelas
      .filter(parcela => parcela.selecionado) // Apenas títulos selecionados
      .map(titulo => ({
        id_titulo: titulo.id_titulo,
        valor: titulo.valor,
        valor_multa: titulo.valor_multa = 0,
        valor_juros: titulo.valor_juros = 0,
        valor_taxa: titulo.valor_taxa = 0,
        valor_atualizado: titulo.valor
      }));

    if (titulos.length === 0) {
      this._alertService.error('Nenhum título selecionado para retirada.');
      return;
    }

    this._alertService.retirada().then(confirmarRetirada => {
      if (!confirmarRetirada) {
        // Se o usuário cancelar a ação, simplesmente retorna e não faz nada
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

      this._alertService.timer(true);

      this._simuladorService.baixarTitulosPago(dadosParaEnvio).subscribe(
        (res) => {
          this._alertService.timer(false);
          this._alertService.success(res.msg);
          this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
        },
        error => {
          this._alertService.timer(false);
          this._alertService.error('Ocorreu um erro ao realizar a retirada.');
        }
      );
    });
  }

  public filtrarTitulos() {
    if (this.filtroSelecionado === 'todos') {
      this.titulosFiltrados = this.detalhamentoSelecionado.parcelas;
    } else if (this.filtroSelecionado === 'acordo') {
      this.titulosFiltrados = this.detalhamentoSelecionado.parcelas.filter(parcela => parcela.numero_contrato.startsWith('ACD'));
    } else if (this.filtroSelecionado === 'semAcordo') {
      this.titulosFiltrados = this.detalhamentoSelecionado.parcelas.filter(parcela => !parcela.numero_contrato.startsWith('ACD'));
    }
  }

  public fechar() {
    this._modalService.dismissAll();
  }

  public cadastrarParcelas(parcela: number, plano: number): void {
    if (plano <= parcela) {
      this._alertService.error('O plano deve ser maior que a parcela.');
      return;
    }

    const quantidadeParcelas = Math.ceil(plano / parcela);
    const parcelas = [];

    for (let i = 0; i < quantidadeParcelas; i++) {
      const valorParcela = i === quantidadeParcelas - 1 ? plano - (parcela * i) : parcela;
      parcelas.push({
        numero: i + 1,
        valor: valorParcela,
        selecionado: false
      });
    }

    this.detalhamentoSelecionado.parcelas = parcelas;
    this.titulosFiltrados = parcelas;
    this._alertService.success('Parcelas cadastradas com sucesso.');
  }

  public gerarParc(): void {
    const { parcela, plano, vencimento, valor, tipo_produto, numero_contrato, numero_documento } = this.formTitulo.value;

    if (!parcela || !plano || !vencimento || !valor) {
      this._alertService.error('Preencha todos os campos necessários para gerar as parcelas.');
      return;
    }

    const dataInicial = new Date(vencimento);
    const parcelas = [];

    for (let i = 0; i < plano; i++) {
      const novaData = new Date(dataInicial);
      novaData.setMonth(dataInicial.getMonth() + i); // Incrementa o mês corretamente

      const novaParcela = {
        parcela: parseInt(parcela, 10) + i,
        plano,
        vencimento: novaData, // Data corrigida
        valor: parseFloat(valor).toFixed(2), // Valor fixo para cada parcela
        tipo_produto,
        numero_contrato,
        numero_documento,
      };
      parcelas.push(novaParcela);
    }

    this.parcelasGeradas = parcelas;
  }



}
