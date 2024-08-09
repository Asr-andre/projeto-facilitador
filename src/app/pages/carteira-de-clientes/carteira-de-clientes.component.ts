import { DatePipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  compararParaOrdenar,
  OrdenarPeloHeaderTabela,
  SortEvent,
} from "src/app/core/helpers/conf-tabela/ordenacao-tabela";
import { Utils } from "src/app/core/helpers/utils";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { CarteiraClienteModel } from "src/app/core/models/carteira.de.cliente.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";
import { CarteiraDeClienteService } from "src/app/core/services/carteira.de.cliente.service";

@Component({
  selector: "app-carteira-de-clientes",
  templateUrl: "./carteira-de-clientes.component.html",
  styleUrl: "./carteira-de-clientes.component.scss",
})
export class CarteiraDeClientesComponent implements OnInit {
  public contratantes: ContratanteModel[] = [];
  public formCarteiraCliente: FormGroup;
  public carteiraDeClientes: CarteiraClienteModel[] = [];
  public idEmpresa = Number(this._authenticationService.getIdEmpresa());
  public contratanteSelecionado: number;
  public login = this._authenticationService.getLogin();
  public filtros: boolean = false;
  public loading: boolean =false;
  public ativaAba: number = 1;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: CarteiraClienteModel[] = [];
  public textoPesquisa: string = "";
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<CarteiraClienteModel>>;

  constructor(
    private _contratanteService: ContratanteService,
    private _carteiraDeClienteService: CarteiraDeClienteService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _formBuilder: FormBuilder,
    private _datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.obterContratantes();
    this.iniciarForm();
  }

  public iniciarForm(): void {
    this.formCarteiraCliente = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: ["", Validators.required],
      cidade: [""],
      uf: [""],
      email: [""],
      celular: [""],
      fone: [""],
      sem_fila: [""],
      com_acordo: [""],
      dias_atraso_inicial: [""],
      dias_atraso_final: [""],
      periodo_vencimento_inicial: [""],
      periodo_vencimento_final: [""],
      periodo_importacao_inicial: [""],
      periodo_importacao_final: [""],
      dias_sem_acionamento_inicial: [""],
      dias_sem_acionamento_final: [""],
      user_login: [this.login, Validators.required],
    });
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alertService.error("Ocorreu um erro ao obter os contratantes.");
        this.loading = false;
      }
    );
  }

  public obterCarteiradeCliente(): void {
    if (this.formCarteiraCliente.valid) {
      this.loading = true;
      const dadosParaEnvio = { ...this.formCarteiraCliente.value };

      dadosParaEnvio.periodo_vencimento_inicial = this._datePipe.transform(dadosParaEnvio.periodo_vencimento_inicial, "dd/MM/yyyy") || "";
      dadosParaEnvio.periodo_vencimento_final = this._datePipe.transform(dadosParaEnvio.periodo_vencimento_final, "dd/MM/yyyy") || "";

      dadosParaEnvio.periodo_importacao_inicial = this._datePipe.transform(dadosParaEnvio.periodo_importacao_inicial, "dd/MM/yyyy") || "";
      dadosParaEnvio.periodo_importacao_final = this._datePipe.transform(dadosParaEnvio.periodo_importacao_final, "dd/MM/yyyy") || "";

      this._carteiraDeClienteService.obterCarteiradeCliente(dadosParaEnvio).subscribe((res) => {
        if (res.success === "true") {
          this.carteiraDeClientes = res.clientes;
          this.filtrar();
          this.atualizarQuantidadeExibida();
          this.ativaAba = 2;
          this.loading = false;
        } else {
          this.loading = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loading = false;
          this._alertService.error("Ocorreu um erro ao filtra os clientes.", error);
        });
    } else {
      this._alertService.warning("O campo 'Contratante' é obrigatório.");
    }
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(
      this.carteiraDeClientes,
      this.textoPesquisa
    );
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(
      this.paginaAtual * this.itensPorPagina,
      this.totalRegistros
    );
  }

  public ordenar({ column, direction }: SortEvent<CarteiraClienteModel>) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    if (direction === "" || column === "") {
      this.dadosFiltrados = this.carteiraDeClientes;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === "asc" ? res : -res;
      });
    }
  }
}
