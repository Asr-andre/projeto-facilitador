import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType } from './apex.model';
import { AcionamentoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/relatorio/acionamento.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AcionamentoService } from 'src/app/core/services/relatorio/acionamento.service';
import { barChart, basicColumChart, basicRadialBarChart, columnlabelChart, dashedLineChart, donutChart, lineColumAreaChart, linewithDataChart, simplePieChart, splineAreaChart } from './data';

@Component({
  selector: 'app-sintetico',
  templateUrl: './sintetico.component.html',
  styleUrl: './sintetico.component.scss'
})
export class SinteticoComponent implements OnChanges {
  @Input() filtros: RequisicaoAcionamentoModel;
  public loadingMin: boolean = false;
  public acio_sintetico: AcionamentoModel[] = [];

  linewithDataChart: ChartType;
  basicColumChart: ChartType;
  columnlabelChart: ChartType;
  lineColumAreaChart: ChartType;
  basicRadialBarChart: ChartType;
  simplePieChart: ChartType;
  donutChart: ChartType;
  barChart: ChartType;
  splineAreaChart: ChartType;
  dashedLineChart: ChartType;

  constructor(
    private _acionamentoService: AcionamentoService,
    private _alert: AlertService,
    private _datePipe: DatePipe,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.acionamentosSintetico();
    }
  }

  public acionamentosSintetico() {
    const dadosParaEnvio = { ...this.filtros };
    dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy");
    dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy");

    this.loadingMin = true;
    this._acionamentoService.obterAcionamentosSintetico(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.acio_sintetico = res.dados || [];

          this.acio_sintetico.sort((a, b) => {
            if (a.total < b.total) return 1;
            if (a.total > b.total) return -1;
            return 0;
          });

          this._fetchData();

        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
      error: (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um erro.", error);
      }
    });
  }

  private _fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = {
      ...columnlabelChart, // Preserva as configurações existentes do gráfico
      series: [
        {
          name: "Total",
          data: this.acio_sintetico.map(acionamento => acionamento.total), // Pega os totais dos acionamentos
        }
      ],
      xaxis: {
        categories: this.acio_sintetico.map(acionamento => acionamento.descricao) // Usa a descrição como eixo X
      },
      title: {
        text: '', // Define o título como vazio para remover o texto
        align: 'center',
        style: {
          fontSize: '11px',
          fontWeight: '900',
          color: '#444',
        },
      },
    };
    this.lineColumAreaChart = lineColumAreaChart;
    this.basicRadialBarChart = basicRadialBarChart;
    this.simplePieChart = simplePieChart;
    this.donutChart = donutChart;
    this.barChart = barChart;
    this.splineAreaChart = splineAreaChart;
    this.dashedLineChart = dashedLineChart;
  }
}
