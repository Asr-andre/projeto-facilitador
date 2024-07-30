import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DetalhamentoModel } from 'src/app/core/models/detalhamento.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { EnvioEmailComponent } from './envio-email/envio-email.component';
import { EnvioSmsComponent } from './envio-sms/envio-sms.component';
import { Utils } from 'src/app/core/helpers/utils';
import { SimulacaoRequisicaoModel, SimulacaoRetornoModel } from 'src/app/core/models/simulador.padrao.model';
import { SimuladorPadraoService } from 'src/app/core/services/simulador.padrao.sevice';
import { SimuladorPadraoComponent } from './simulador-padrao/simulador-padrao.component';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-detalhe-da-divida',
  templateUrl: './detalhe-da-divida.component.html',
  styleUrls: ['./detalhe-da-divida.component.scss']
})
export class DetalheDaDividaComponent implements OnChanges {
  @ViewChild(WhatsappComponent) whatsappComponent: WhatsappComponent;
  @ViewChild(EnvioEmailComponent) EnvioEmailComponent: EnvioEmailComponent;
  @ViewChild(EnvioSmsComponent) EnvioSmsComponent: EnvioSmsComponent;
  @ViewChild(SimuladorPadraoComponent) SimuladorPadraoComponent: SimuladorPadraoComponent;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public detalhamentoSelecionado: DetalhamentoModel | null = null;
  public loadingMin: boolean = false;
  @Output() dadosEnviado: EventEmitter<void> = new EventEmitter<void>();
  public selecionarTodos: boolean = true;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login = this._authService.getLogin();

  constructor(
    private _dashboard: DashboardService,
    private _alertService: AlertService,
    private _simuladorPadraoService: SimuladorPadraoService,
    private _authService: AuthenticationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente || changes.idContratante) {
      this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
    }
  }

  ngAfterViewInit() {
    if (this.EnvioEmailComponent) {
      this.EnvioEmailComponent.dadosEnviado.subscribe(() => {
        this.dadosEnviado.emit();
      });
    }

    if (this.EnvioSmsComponent) {
      this.EnvioSmsComponent.dadosEnviado.subscribe(() => {
        this.dadosEnviado.emit();
      });
    }
  }

  public obterDetalhamentoPorId(id_cliente: number | undefined, id_contratante: number | undefined): void {
    if (id_cliente == null || id_contratante == null) {
      return;
    }

    this.loadingMin = true;
    this._dashboard.obterDevedorPorId(id_cliente, id_contratante).subscribe(
      (detalhamento) => {
        if (detalhamento && detalhamento.success) {
          this.detalhamentoSelecionado = detalhamento;
          if (this.detalhamentoSelecionado.parcelas) {
            this.detalhamentoSelecionado.parcelas.forEach(parcela => {
              parcela.selecionado = true;
            });
          }
          this.loadingMin = false;
        }
      },
      (error) => {
        this._alertService.error('Não foi possível pesquisar o cliente!');
        this.loadingMin = false;
      }
    );
  }

  public calcularTotal(coluna: string): number {
    if (this.detalhamentoSelecionado?.parcelas) {
      return this.detalhamentoSelecionado.parcelas.reduce((total, prestacao) => {
        if (coluna === 'valorTotalAtualizado') {
          return total + this.calcularTotalAtualizado(prestacao);
        }
        return total + (prestacao[coluna] || 0);
      }, 0);
    }
    return 0;
  }

  public calcularTotalAtualizado(prestacao: any): number {
    return (prestacao.valor || 0) +
      (prestacao.valor_juros || 0) +
      (prestacao.valor_multa || 0) +
      (prestacao.valor_taxa || 0);
  }

  public abrirWhatsappModal(telefone: string): void {
    this.whatsappComponent.abrirModalWhatsapp(telefone);
  }

  public abrirEmailModal(email: string): void {
    this.EnvioEmailComponent.abrirModalEmail(email, this.idCliente, this.idContratante);
  }

  public abrirSmsModal(sms: string): void {
    this.EnvioSmsComponent.abrirModalSms(sms, this.idCliente, this.idContratante);
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
    if (this.detalhamentoSelecionado && this.detalhamentoSelecionado.parcelas) {
      this.detalhamentoSelecionado.parcelas.forEach(parcela => {
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
}
