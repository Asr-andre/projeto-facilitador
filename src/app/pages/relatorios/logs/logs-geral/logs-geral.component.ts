import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Log } from 'src/app/core/models/logs.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { LogsService } from 'src/app/core/services/logs.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';

@Component({
  selector: 'app-logs-geral',
  templateUrl: './logs-geral.component.html',
  styleUrl: './logs-geral.component.scss'
})
export class LogsGeralComponent implements OnInit, OnChanges {
  @Input() filtros: any;
  public loadingMin: boolean = false;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public logs: Log [] = [];
  public resultFiltros: Log [] = [];
  public dadosFiltrados: Log [] = [];
  public textoPesquisa: string = "";
  public loading: boolean = false;

  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Log>>;

  constructor(
    private _logsService: LogsService,
    private _auth: AuthenticationService,
    private _datePipe: DatePipe,
    private _alertService: AlertService,
    private _excelService: ExcelService,

  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.relatorioGeral();
    }
  }

  public async exportExcel(): Promise<void> {
    await this._alertService.impressaoDocumento();
    this._excelService.exportAsExcelFile(this.dadosFiltrados, 'exportacao_detalhamento_log_geral');
  }

  public async gerarPDFPaisagem(): Promise<void> {
    // Seleciona o elemento HTML que você quer converter em PDF
    const elemento = document.getElementById('conteudoPDF');

    await this._alertService.impressaoDocumento();
    if (elemento) {
      html2canvas(elemento).then((canvas) => {
        const imagemData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para paisagem

        // Ajusta a imagem ao tamanho do PDF
        const larguraPDF = pdf.internal.pageSize.getWidth();
        const alturaPDF = (canvas.height * larguraPDF) / canvas.width;

        pdf.addImage(imagemData, 'PNG', 0, 0, larguraPDF, alturaPDF);
        pdf.save('exportacao_detalhamento_log_geral.pdf'); // Nome do arquivo gerado
      });
    } else {
      console.error('Elemento não encontrado!');
    }
  }

  public relatorioGeral() {
    if (this.filtros) {
      const dadosParaEnvio = { ...this.filtros };

      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";

      this.loadingMin = true;

      this._logsService.listarLogs(dadosParaEnvio).subscribe((res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.logs = res.logs;
          this.resultFiltros = res.logs;
          this.dadosFiltrados = res.logs;
        } else {
          this._alertService.error('Nenhum resultado encontrado.');
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Erro ao obter os filtros.');
        }
      );
    } else {
      this.loadingMin = false;
      this._alertService.error('Preencha todos os campos obrigatórios.');
    }
  }

  public ordenar({ column, direction }: SortEvent<Log>) {
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

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
