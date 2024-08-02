
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from "src/app/core/helpers/conf-tabela/ordenacao-tabela";
import { Utils } from "src/app/core/helpers/utils";
import { RespostaCardsModel } from "src/app/core/models/cards.dashboard.model";
import { DevedorModel, RequisicaoDevedorModel, RespostaDevedorModel } from "src/app/core/models/devedor.model";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DashboardService } from "src/app/core/services/dashboard.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public listarDevedores: DevedorModel[] = [];
  public devedoresFiltrados: DevedorModel[] = [];
  public devedorSelecionado: DevedorModel | null = null;
  public loading: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: DevedorModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<DevedorModel>>;

  public qtdeEmail: number = 0;
  public totalEmail: number = 0;
  public qtdeSms: number = 0;
  public totalSms: number = 0;
  public qtdeWhatsapp: number = 0;
  public totalWhatsapp: number = 0;
  public totalUtilizado: number = 0;
  public saldo: number = 0;

  public tipoPesquisa: string = 'nome';
  public mostrarSemDivida: boolean = false;

  constructor(
    private _dashboard: DashboardService,
    private _authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.obterDevedores();
  }

  public obterDevedores(): void {
    this.loading = true;
    this._dashboard.obterDevedores({ id_empresa: this.idEmpresa }).subscribe((res: RespostaDevedorModel) => {
      this.listarDevedores = res.clientes;
      this.filtrar();
      this.atualizarQuantidadeExibida();
      this.obterDadosDosCards();
      this.loading = false;
    });
  }

  public atualizar(): void {
    this.obterDevedores();
  }

  public obterDadosDosCards(): void {
    this._dashboard.obterCards().subscribe(
      (response: RespostaCardsModel) => {
        if (response && response.success !== undefined) {
          if (response.success === 'true' || response.success) {
            this.qtdeEmail = response.qtde_email || 0;
            this.totalEmail = response.total_email || 0;
            this.qtdeSms = response.qtde_sms || 0;
            this.totalSms = response.total_sms || 0;
            this.totalUtilizado = response.total_utilizado || 0;
            this.saldo = response.saldo || 0;
          } else {
            console.error('Erro na resposta da API:', response.msg || 'Mensagem não disponível');
          }
        } else {
          console.error('Resposta inválida da API:', response);
        }
      },
      (error) => {
        console.error('Erro ao obter os cards:', error);
      }
    );
  }

  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
  }

  public filtrar(): void {
    const filtro: RequisicaoDevedorModel = {
      id_empresa: this.idEmpresa,
      mostrar_cliente_sem_divida: this.mostrarSemDivida ? "S" : "N"
    };

    if (this.tipoPesquisa === 'cpf') {
      filtro.cnpj_cpf = this.textoPesquisa;
    } else {
      filtro.nome = this.textoPesquisa;
    }

    this._dashboard.obterDevedores(filtro).subscribe((res) => {
      this.dadosFiltrados = res.clientes;
      this.totalRegistros = this.dadosFiltrados.length;
      this.atualizarQuantidadeExibida();
    });
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<DevedorModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.listarDevedores;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public atualizarCards(): void {
    this.obterDadosDosCards();
  }
}
