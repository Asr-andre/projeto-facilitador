
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from "src/app/core/helpers/conf-tabela/ordenacao-tabela";
import { Utils } from "src/app/core/helpers/utils";
import { RequisicaoCardsModel, RespostaCardsModel } from "src/app/core/models/cards.dashboard.model";
import { DevedorModel, RespostaDevedorModel } from "src/app/core/models/devedor.model";
import { FilaModel } from "src/app/core/models/fila.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { FilaService } from "src/app/core/services/fila.service";
import { SolicitarCreditosComponent } from "./componente/solicitar-creditos/solicitar-creditos.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild(SolicitarCreditosComponent) SolicitarCreditosComponent: SolicitarCreditosComponent;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._authService.getCurrentUser() || 0);
  public login = this._authService.getLogin();
  public listarDevedores: DevedorModel[] = [];
  public filas: FilaModel[] = [];
  public devedorSelecionado: DevedorModel | null = null;
  public loading: boolean = false;
  public formFila: FormGroup;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 12;
  public dadosFiltrados: DevedorModel[] = [];
  public textoPesquisa: string = "";
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

  public tipoPesquisa: string = "nome";
  public mostrarSemDivida: boolean = false;

  constructor(
    private _dashboard: DashboardService,
    private _authService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _filaService: FilaService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.inicializarFormFila()
    this.atualizarCards();
  }

  public inicializarFormFila() {
    this.formFila = this._formBuilder.group({
      id_fila: [0],
    });
  }

  public carregarFilas() {
    if (!this.filas.length) {
      this.obterFilas();
    }
  }

  public filaCliente(): void {
    const filtros = this.construirFiltros(this.formFila.get("id_fila")?.value || 0);
    this.obterDevedores(filtros);
  }

  public pesquisaCliente(): void {
    const filtros = this.construirFiltros(0);
    this.obterDevedores(filtros);
  }

  private construirFiltros(idFila: number): any {
    return {
        id_empresa: this.idEmpresa,
        id_fila: idFila,
        id_usuario: this.idUsuario,
        nome: this.tipoPesquisa === "nome" ? this.textoPesquisa : "",
        cnpj_cpf: this.tipoPesquisa === "cpf" ? this.textoPesquisa : "",
        mostrar_cliente_sem_dividas: this.mostrarSemDivida ? "S" : "N",
    };
  }

  public obterDevedores(filtros: any): void {
    this.loading = true;

    this._dashboard.obterDevedores(filtros).subscribe((res: RespostaDevedorModel) => {
      if (res && res.success === "true") {
        this.listarDevedores = res.clientes;
        this.dadosFiltrados = res.clientes;
        this.totalRegistros = this.dadosFiltrados.length;
        this.atualizarQuantidadeExibida();

        // Seleciona automaticamente o primeiro devedor, da fila
        if (this.listarDevedores.length > 0) {
          this.selecionarDevedor(this.listarDevedores[0]);
      }

        this.loading = false;
      } else {
        this.loading = false;
        this._alertService.warning(res.msg);
      }
    });
  }

  public obterFilas() {
    const requisicao = {
      id_usuario: this.idUsuario,
      id_empresa: this.idEmpresa,
      user_login: this.login,
    };

    this.loading = true;
    this._filaService.obterFilas(requisicao).subscribe((res) => {
      if (res && res.success === "true") {
        this.filas = res.filas;
        this.loading = false;
      }else {
        this._alertService.warning(res.msg);
        this.loading = false;
      }
    }, () => this.loading = false);
  }

  public obterDadosDosCards(): void {
    const requisicao: RequisicaoCardsModel = {
      id_empresa: this.idEmpresa,
    }

    this._dashboard.obterCards(requisicao).subscribe((response: RespostaCardsModel) => {
      if (response && response.success !== undefined) {
        if (response.success === "true" || response.success) {
          this.qtdeEmail = response.qtde_email || 0;
          this.totalEmail = response.total_email || 0;
          this.qtdeSms = response.qtde_sms || 0;
          this.totalSms = response.total_sms || 0;
          this.qtdeWhatsapp = response.qtde_whatsapp || 0;
          this.totalWhatsapp = response.total_whatsapp || 0;
          this.totalUtilizado = response.total_utilizado || 0;
          this.saldo = response.saldo || 0;
        } else {
          console.error("Erro na resposta da API:",response.msg || "Mensagem não disponível");
        }
      } else {
        console.error("Resposta inválida da API:", response);
      }
    },
      (error) => {
        console.error("Erro ao obter os cards:", error);
      }
    );
  }

  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(
      this.paginaAtual * this.itensPorPagina,
      this.totalRegistros
    );
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public atualizar(): void {
    this.filaCliente();
  }

  public atualizarCards(): void {
    if(this.idEmpresa > 0) {
      this.obterDadosDosCards();
    }
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

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public abrirCreditoModal(): void {
    this.SolicitarCreditosComponent.abrirModaSolicitarCredito();
  }
}
