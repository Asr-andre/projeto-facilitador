import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { TituloLiquidado } from 'src/app/core/models/financeiro.model';
import { FinanceiroService } from 'src/app/core/services/financeiro.service';
import { Utils } from 'src/app/core/helpers/utils';

@Component({
  selector: 'app-prestacao-contas',
  templateUrl: './prestacao-contas.component.html',
  styleUrl: './prestacao-contas.component.scss'
})
export class PrestacaoContasComponent implements OnInit, OnChanges  {
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

  registros = [
    { cpf: '46419730325', nomeCliente: 'PEDRO SOUZA AMARAL', vencimento: '09/07/2024', dtPago: '06/01/2024', parcPla: '01/12', valorPrincipal: 525.00, valorPago: 600.00, comissao: 75.00, repasse: 525.00 },
    { cpf: '46419730325', nomeCliente: 'PEDRO SOUZA AMARAL', vencimento: '09/07/2024', dtPago: '06/01/2024', parcPla: '02/12', valorPrincipal: 525.00, valorPago: 590.00, comissao: 65.00, repasse: 525.00 },
    { cpf: '12314569874', nomeCliente: 'André da Silva Botelho Júnior', vencimento: '09/01/2023', dtPago: '06/01/2024', parcPla: '01/01', valorPrincipal: 80.00, valorPago: 100.00, comissao: 20.00, repasse: 80.00 }
  ];

  constructor(
      private _financeiro: FinanceiroService,
      private _auth: AuthenticationService,
      private _datePipe: DatePipe,
      private _alert: AlertService,
      private _excel: ExcelService,
      private _modal: NgbModal
  
    ) { }

  ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['filtros'] && this.filtros) {
        this.relatorioGeral();
      }
    }

    get totalPrincipal() {
      return this.registros.reduce((total, registro) => total + registro.valorPrincipal, 0);
    }

    get totalPago() {
      return this.registros.reduce((total, registro) => total + registro.valorPago, 0);
    }

    get totalComissao() {
      return this.registros.reduce((total, registro) => total + registro.comissao, 0);
    }

    get totalRepasse() {
      return this.registros.reduce((total, registro) => total + registro.repasse, 0);
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

        this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public exportExcel() {

    }

    public relatorioGeral() {
        if (this.filtros) {
          const dadosParaEnvio = { ...this.filtros };
          console.log(this.filtros)
    
          dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
          dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";
    
          this.loadingMin = true;
    
          this._financeiro.obterFiltros(dadosParaEnvio).subscribe(
            (res) => {
              this.loadingMin = false;
              if (res.success === 'true') {
                this.resultFiltros = res.titulos;
                this.dadosFiltrados = res.titulos;
                this.calcularTotais();
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
    
    public fechar() {
      this._modal.dismissAll();
    }

}
