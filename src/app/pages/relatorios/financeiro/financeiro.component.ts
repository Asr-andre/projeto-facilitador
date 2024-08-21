import { DatePipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { TituloLiquidado } from 'src/app/core/models/financeiro.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { FinanceiroService } from 'src/app/core/services/financeiro.service';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent {
  public contratantes: ContratanteModel [] = [];
  public contratanteSelecionado: number;
  public resultFiltros: TituloLiquidado [] = [];;
  public formFiltros: FormGroup;
  public filtros: boolean = false;
  public loading: boolean =false;
  public ativaAba: number = 1;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();

  public dadosFiltrados: TituloLiquidado[] = [];
  public textoPesquisa: string = "";
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<TituloLiquidado>>;

  public totalPagamentos: number = 0;
  public valorTotalPago: number = 0;
  public valorTotalOriginal: number = 0;
  public valorTotalJuros: number = 0;
  public valorTotalMulta: number = 0;
  public valorTotalTaxa: number = 0;

  constructor(
    private _financeiroService: FinanceiroService,
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _datePipe: DatePipe,
    private _alertService: AlertService

  ) { }

  ngOnInit(): void {
    this.iniciarForm();
    this.obterContratantes();
  }

  public iniciarForm(): void {
    this.formFiltros = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: ["0"],
      data_inicio: ["", Validators.required],
      data_fim: ["", Validators.required],
      user_login: [this.login, Validators.required],
    });
  }

  public obterFiltros() {
    if (this.formFiltros.valid) {
      const dadosParaEnvio = { ...this.formFiltros.value };

      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";

      this.loading = true;

      this._financeiroService.obterFiltros(dadosParaEnvio).subscribe(
        (res) => {
          this.loading = false;
          if (res.success === 'true') {
            this.resultFiltros = res.titulos;
            this.dadosFiltrados = res.titulos;
            this.calcularTotais();
            this.ativaAba = 2;
          } else {
            this._alertService.error('Nenhum resultado encontrado.');
          }
        },
        (error) => {
          this.loading = false;
          this._alertService.error('Erro ao obter os filtros.');
        }
      );
    } else {
      this._alertService.error('Formulário inválido. Por favor, preencha todos os campos obrigatórios.');
    }
  }

  public calcularTotais(): void {
    this.totalPagamentos = this.dadosFiltrados.length;
    this.valorTotalPago = this.dadosFiltrados.reduce((sum, item) => sum + (item.valor_pago || 0), 0);
    this.valorTotalOriginal = this.dadosFiltrados.reduce((sum, item) => sum + (item.valor_original || 0), 0);
    this.valorTotalJuros = this.dadosFiltrados.reduce((sum, item) => sum + (item.valor_juros || 0), 0);
    this.valorTotalMulta = this.dadosFiltrados.reduce((sum, item) => sum + (item.valor_multa || 0), 0);
    this.valorTotalTaxa = this.dadosFiltrados.reduce((sum, item) => sum + (item.valor_taxa || 0), 0);
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

  public ordenar({ column, direction }: SortEvent<TituloLiquidado>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.resultFiltros;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.resultFiltros, this.textoPesquisa);
  }
}
