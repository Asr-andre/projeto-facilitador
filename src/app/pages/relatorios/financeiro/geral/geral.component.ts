import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { TituloLiquidado } from 'src/app/core/models/financeiro.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { FinanceiroService } from 'src/app/core/services/financeiro.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrl: './geral.component.scss'
})
export class GeralComponent implements OnInit, OnChanges {
  @Input() filtros: any;
  public loadingMin: boolean = false;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public resultFiltros: TituloLiquidado[] = [];;
  public dadosFiltrados: TituloLiquidado[] = [];
  public textoPesquisa: string = "";
  public loading: boolean = false;

  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<TituloLiquidado>>;

  public totalPagamentos: number = 0;
  public valorTotalPago: number = 0;
  public valorTotalOriginal: number = 0;
  public valorTotalJuros: number = 0;
  public valorTotalMulta: number = 0;
  public valorTotalTaxa: number = 0;

  public valorDescPrincipal: number = 0;
  public valorDescMulta: number = 0;
  public valorDescJuros: number = 0;
  public valorReceitaPrincipal: number = 0;
  public valorReceitaMulta: number = 0;
  public valorReceitaJuros: number = 0;
  public valorReceitaTaxa: number = 0;
  public valorComissao: number = 0;
  public valorRepasse: number = 0;

  constructor(
    private _financeiroService: FinanceiroService,
    private _auth: AuthenticationService,
    private _datePipe: DatePipe,
    private _alertService: AlertService,
    private _excelService: ExcelService

  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.relatorioGeral();
    }
  }

  public exportExcel() {
    this._excelService.exportAsExcelFile(this.dadosFiltrados, 'exportacaoPagamentos');
  }

  public gerarPDF(): void {
    // Seleciona o elemento HTML que você quer converter em PDF
    const elemento = document.getElementById('conteudoPDF');

    if (elemento) {
      html2canvas(elemento).then((canvas) => {
        const imagemData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para paisagem

        // Ajusta a imagem ao tamanho do PDF
        const larguraPDF = pdf.internal.pageSize.getWidth();
        const alturaPDF = (canvas.height * larguraPDF) / canvas.width;

        pdf.addImage(imagemData, 'PNG', 0, 0, larguraPDF, alturaPDF);
        pdf.save('detalhamento_geral.pdf'); // Nome do arquivo gerado
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

      this._financeiroService.obterFiltros(dadosParaEnvio).subscribe(
        (res) => {
          this.loadingMin = false;
          if (res.success === 'true') {
            this.resultFiltros = res.titulos;
            this.dadosFiltrados = res.titulos;
            this.calcularTotais();
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
    this.valorDescPrincipal = this.dadosFiltrados.reduce((sum, item) => sum + (item.desc_principal || 0), 0);
    this.valorDescMulta = this.dadosFiltrados.reduce((sum, item) => sum + (item.desc_multa || 0), 0);
    this.valorDescJuros = this.dadosFiltrados.reduce((sum, item) => sum + (item.desc_juros || 0), 0);
    this.valorReceitaPrincipal = this.dadosFiltrados.reduce((sum, item) => sum + (item.receita_principal || 0), 0);
    this.valorReceitaMulta = this.dadosFiltrados.reduce((sum, item) => sum + (item.receita_multa || 0), 0);
    this.valorReceitaJuros = this.dadosFiltrados.reduce((sum, item) => sum + (item.receita_juros || 0), 0);
    this.valorReceitaTaxa = this.dadosFiltrados.reduce((sum, item) => sum + (item.receita_taxa || 0), 0);
    this.valorComissao = this.dadosFiltrados.reduce((sum, item) => sum + (item.comissao || 0), 0);
    this.valorRepasse = this.dadosFiltrados.reduce((sum, item) => sum + (item.repasse || 0), 0);

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
