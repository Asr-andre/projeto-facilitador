import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ApexChart, ApexAxisChartSeries, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { AcionamentoAnaliticoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/relatorio/acionamento.model';
import { AcionamentoService } from 'src/app/core/services/relatorio/acionamento.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { DatePipe } from '@angular/common';
import { Utils } from 'src/app/core/helpers/utils';

export type OpcoesGrafico = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-acoes-realizadas-por-contratante',
  templateUrl: './acoes-realizadas-por-contratante.component.html',
  styleUrls: ['./acoes-realizadas-por-contratante.component.scss']
})
export class AcoesRealizadasPorContratanteComponent implements OnChanges {
  @Input() filtros: RequisicaoAcionamentoModel;
  public acoesAnaliticas: AcionamentoAnaliticoModel[] = [];
  public dadosTabela: any[] = [];
  public opcoesGrafico: Partial<OpcoesGrafico>;
  public colunaOrdenacao: string = 'contratante';

  public carregandoDados: boolean = false;

  constructor(
    private _acionamento: AcionamentoService,
    private _alert: AlertService,
    private _pipeData: DatePipe,
  ) {
    this.opcoesGrafico = {
      series: [],
      chart: {
        type: 'bar',
        height: 350
      },
      title: {
        text: 'Ações por Contratante'
      },
      xaxis: {
        categories: []
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.obterAcoes();
    }
  }

  private obterAcoes() {
    const dadosParaEnvio = { ...this.filtros };
    dadosParaEnvio.data_inicio = this._pipeData.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy");
    dadosParaEnvio.data_fim = this._pipeData.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy");

    this.carregandoDados = true;
    this._acionamento.obterAcionamentosAnalitico(dadosParaEnvio).subscribe({
      next: (res) => {
        this.carregandoDados = false;
        if (res.success === 'true') {
          this.acoesAnaliticas = res.dados;
          this.processarDados();
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: () => {
        this.carregandoDados = false;
        this._alert.error('Erro ao carregar os dados.');
      }
    });
  }

  private processarDados() {
    const mapaContratante = new Map<string, any>();

    this.acoesAnaliticas.forEach(item => {
      const chave = `${item.contratante}-${item.acao}`;
      if (mapaContratante.has(chave)) {
        const existente = mapaContratante.get(chave);
        existente.quantidade++;
        existente.ultimaData = new Date(existente.ultimaData) > new Date(item.data_acio)
          ? existente.ultimaData
          : item.data_acio;
      } else {
        mapaContratante.set(chave, {
          contratante: item.contratante,
          acao: item.acao,
          quantidade: 1,
          ultimaData: item.data_acio
        });
      }
    });

    this.dadosTabela = Array.from(mapaContratante.values());

    const categorias = Array.from(new Set(this.dadosTabela.map(d => d.contratante)));
    const dadosSeries = categorias.map(cat => {
      return this.dadosTabela
        .filter(d => d.contratante === cat)
        .reduce((total, d) => total + d.quantidade, 0);
    });

    this.opcoesGrafico.series = [
      {
        name: 'Quantidade de Ações',
        data: dadosSeries
      }
    ];
    this.opcoesGrafico.xaxis.categories = categorias;
  }
}
