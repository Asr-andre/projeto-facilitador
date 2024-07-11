import { Component, OnInit, ViewChild } from "@angular/core";
import { DevedorModel } from "src/app/core/models/devedor.model";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { DetalhamentoModel } from "src/app/core/models/detalhamento.model";
import { WhatsappComponent } from "./componente/whatsapp/whatsapp.component";
import { AlertService } from "src/app/core/services/alert.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild(WhatsappComponent) whatsappComponent: WhatsappComponent;
  public listarDevedores: DevedorModel[] = [];
  public devedoresFiltrados: DevedorModel[] = [];
  public textoPesquisa: string = "";
  public paginaAtual: number = 1;
  public itensPorPagina: number = 20;
  public devedorSelecionado: DevedorModel | null = null;
  public detalhamentoSelecionado: DetalhamentoModel | null = null;
  public loading: boolean = false;

  constructor(
    private _dashboard: DashboardService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.obterDevedores();
  }

  public obterDevedores(): void {
    this.loading = true;
    this._dashboard.obterDevedores().subscribe((res) => {
      this.listarDevedores = res;
      this.devedoresFiltrados = res;
      this.loading = false;
    });
  }

  public obterDetalhamentoPorId( id_cliente: number, id_contratante: number ): void {
    this.loading = true;
    this._dashboard.obterDevedorPorId(id_cliente, id_contratante).subscribe((detalhamento) => {
        if (detalhamento && detalhamento.success) {
          this.detalhamentoSelecionado = detalhamento;
          this.loading = false;
        }
      },
      (error) => {
        this._alertService.error("Não foi possível pesquisar o cliente!");
        this.loading = false;
      }
    );
  }

  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
    this.obterDetalhamentoPorId(devedor.id_cliente, devedor.id_contratante);
  }

  public calcularTotal(coluna: string): number {
    return (
      this.detalhamentoSelecionado?.parcelas.reduce((total, prestacao) => {
          if (coluna === 'valorTotalAtualizado') {
            return total + this.calcularTotalAtualizado(prestacao);
          }
          return total + prestacao[coluna];
        },
        0
      ) || 0
    );
  }

  public calcularTotalAtualizado(prestacao: any): number {
    return prestacao.valor + prestacao.valor_juros + prestacao.valor_multa + prestacao.valor_taxa;
  }

  public filtraDevedor(): void {
    const pesquisa = this.textoPesquisa.toLowerCase();
    this.devedoresFiltrados = this.listarDevedores.filter((devedor) =>
      [
        devedor.id_cliente.toString(),
        devedor.id_contratante.toString(),
        devedor.cnpj_cpf,
        devedor.fantasia,
        devedor.nome,
        devedor.saldo_devedor.toString(),
      ].some((field) => field.toLowerCase().includes(pesquisa))
    );
  }

  public openWhatsappModal(telefone: string): void {
    this.whatsappComponent.abrirModalWhatsapp(telefone);
  }
}
