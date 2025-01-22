import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Processos } from 'src/app/core/models/relatorio/juridico.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { JuridicoService } from 'src/app/core/services/relatorio/juridico.service';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrl: './geral.component.scss'
})
export class GeralComponent implements OnInit, OnChanges {
  @Input() filtros: any;
  @Output() exibirCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loadingMin: boolean = false;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public resultFiltros: Processos[] = [];;
  public dadosFiltrados: Processos[] = [];
  public textoPesquisa: string = "";
  public loading: boolean = false;

  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Processos>>;

  constructor(
    private _juridico: JuridicoService,
    private _auth: AuthenticationService,
    private _datePipe: DatePipe,
    private _alert: AlertService,
    private _excel: ExcelService,

  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.relatorioGeral();
    }
  }

  public async exportExcel(): Promise<void> {
    await this._alert.impressaoDocumento();
    this._excel.exportAsExcelFile(this.dadosFiltrados, 'exportacaoProcessos');
  }

  public relatorioGeral() {
    if (this.filtros) {
      const dadosParaEnvio = { ...this.filtros };

      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";

      this.loadingMin = true;

      this._juridico.pesquisarJuridico(dadosParaEnvio).subscribe(
        (res) => {
          this.loadingMin = false;
          if (res.success === 'true') {
            this.resultFiltros = res.processos;
            this.dadosFiltrados = res.processos;
            this.exibirCard.emit(true);

          } else {
            this._alert.error('Nenhum resultado encontrado.');
            this.exibirCard.emit(false);
          }
        },
        (error) => {
          this.loadingMin = false;
          this.exibirCard.emit(false);
          this._alert.error('Erro ao obter os filtros.');
        }
      );
    } else {
      this.exibirCard.emit(false);
      this._alert.error('Formulário inválido. Por favor, preencha todos os campos obrigatórios.');
    }
  }

  public ordenar({ column, direction }: SortEvent<Processos>) {
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

