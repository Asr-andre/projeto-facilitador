import { Component, OnInit } from '@angular/core';
import { ChartType } from './apex.model';
import { barChart, basicColumChart, basicRadialBarChart, columnlabelChart, dashedLineChart, donutChart, lineColumAreaChart, linewithDataChart, simplePieChart, splineAreaChart } from './data';
import { AcionamentoService } from 'src/app/core/services/relatorio/acionamento.service';
import { AcionamentoModel } from 'src/app/core/models/relatorio/acionamento.model';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-acionamentos-sintetico',
  templateUrl: './acionamentos-sintetico.component.html',
  styleUrl: './acionamentos-sintetico.component.scss'
})
export class AcionamentosSinteticoComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

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

  public acionamentos: AcionamentoModel[] = [];
  public loadingMin: boolean = false;

  constructor(
    private _acionamentoService: AcionamentoService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.obterAcionamentosSintetico();

    /**
     * Fethches the chart data
     */
    this._fetchData();
  }

  /**
   * Fetches the chart data
   */

  public obterAcionamentosSintetico() {
    const dados = {
      id_empresa: 1,
      id_contratante: 1,
      data_inicio: '01/12/2024',
      data_fim: '31/12/2024',
      user_login: 'Paulo'
    }

    this.loadingMin = true;
    this._acionamentoService.obterAcionamentosSintetico(dados).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.acionamentos = res.dados;

          // Ordena a coluna data em ordem descendente
          this.acionamentos.sort((a, b) => {
            if (a.login < b.login) return 1;
            if (a.login > b.login) return -1;
            return 0;
          });
          this._fetchData();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um error.", error);
        }
      }
    });
  }

  private _fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = { ...columnlabelChart, // Preserva as configurações existentes do gráfico
      series: [
        {
          name: "Total",
          data: this.acionamentos.map(acionamento => acionamento.total), // Pega os totais dos acionamentos
        }
      ],
      xaxis: {
        categories: this.acionamentos.map(acionamento => acionamento.descricao) // Usa a descrição como eixo X
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
