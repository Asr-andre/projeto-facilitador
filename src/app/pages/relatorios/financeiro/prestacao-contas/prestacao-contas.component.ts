import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { TituloLiquidado } from 'src/app/core/models/financeiro.model';
import { FinanceiroService } from 'src/app/core/services/financeiro.service';
import { Utils } from 'src/app/core/helpers/utils';
import { ExcelService } from 'src/app/core/services/excel.service';

@Component({
  selector: 'app-prestacao-contas',
  templateUrl: './prestacao-contas.component.html',
  styleUrl: './prestacao-contas.component.scss'
})
export class PrestacaoContasComponent implements OnInit, OnChanges {
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

  constructor(
    private _financeiro: FinanceiroService,
    private _auth: AuthenticationService,
    private _datePipe: DatePipe,
    private _alert: AlertService,
    private _modal: NgbModal,
    private _excel: ExcelService,

  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.relatorioGeral();
    }
  }

  get nomeEmpresa() {
    return this.dadosFiltrados[0]?.fantasia || '';
  }

  get totalPrincipal() {
    return this.dadosFiltrados.reduce((total, dadosFiltrados) => total + dadosFiltrados.valor_original, 0);
  }

  get totalPago() {
    return this.dadosFiltrados.reduce((total, dadosFiltrados) => total + dadosFiltrados.valor_pago, 0);
  }

  get totalComissao() {
    return this.dadosFiltrados.reduce((total, dadosFiltrados) => total + dadosFiltrados.comissao, 0);
  }

  get totalRepasse() {
    return this.dadosFiltrados.reduce((total, dadosFiltrados) => total + dadosFiltrados.repasse, 0);
  }

  public gerarPDF(): void {
    // Seleciona o elemento HTML que você quer converter em PDF
    const elemento = document.getElementById('conteudoPDF');

    if (elemento) {
      html2canvas(elemento).then((canvas) => {
        const imagemData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

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

  public abrirModalRelatorio(content: TemplateRef<any>): void {
    const fantasiasUnicas = new Set(this.dadosFiltrados.map(dado => dado.fantasia));

    if (fantasiasUnicas.size === 1) {
      this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    } else {
      this._alert.warning('Não é possível abrir o relatório, pois existem múltiplos contratante selecionados.');
    }
  }

  public async exportExcel(): Promise<void> {
    await this._alert.impressaoDocumento();
    this._excel.exportAsExcelFile(this.dadosFiltrados, 'exportacaoPrestacaoConta');
  }

  public relatorioGeral() {
    if (this.filtros) {
      const dadosParaEnvio = { ...this.filtros };

      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";

      this.loadingMin = true;

      this._financeiro.obterFiltros(dadosParaEnvio).subscribe(
        (res) => {
          this.loadingMin = false;
          if (res.success === 'true') {
            this.resultFiltros = res.titulos;
            this.dadosFiltrados = res.titulos;
          } else {
            this._alert.error('Nenhum resultado encontrado.');
          }
        },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Erro ao obter os filtros.');
        }
      );
    } else {
      this._alert.error('Formulário inválido. Por favor, preencha todos os campos obrigatórios.');
    }
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

  public fechar() {
    this._modal.dismissAll();
  }
}
