import { Component, OnInit } from "@angular/core";
import { DevedorModel } from "src/app/core/models/devedor.model";
import { DashboardService } from "src/app/core/services/dashboard.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {

  public listarDevedores: DevedorModel[] = [];
  public devedoresFiltrados: DevedorModel[] = [];
  public textoPesquisa: string = "";
  public paginaAtual: number = 1;
  public itensPorPagina: number = 20;
  public devedorSelecionado: DevedorModel | null = null;
  public loading: boolean = false;

  constructor(
    private _dashboard: DashboardService,
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

  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
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

  public formatarCPF(cpf: string): string {
    if (!cpf) return '';

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
