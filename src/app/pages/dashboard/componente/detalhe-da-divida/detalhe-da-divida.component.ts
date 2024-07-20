import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DetalhamentoModel } from 'src/app/core/models/detalhamento.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { EnvioEmailComponent } from './envio-email/envio-email.component';
import { EnvioSmsComponent } from './envio-sms/envio-sms.component';

@Component({
  selector: 'app-detalhe-da-divida',
  templateUrl: './detalhe-da-divida.component.html',
  styleUrls: ['./detalhe-da-divida.component.scss']
})
export class DetalheDaDividaComponent implements OnChanges {
  @ViewChild(WhatsappComponent) whatsappComponent: WhatsappComponent;
  @ViewChild(EnvioEmailComponent) EnvioEmailComponent: EnvioEmailComponent;
  @ViewChild(EnvioSmsComponent) EnvioSmsComponent: EnvioSmsComponent;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public detalhamentoSelecionado: DetalhamentoModel | null = null;
  public loadingMin: boolean = false;

  constructor(
    private _dashboard: DashboardService,
    private _alertService: AlertService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente || changes.idContratante) {
      this.obterDetalhamentoPorId(this.idCliente, this.idContratante);
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
}
