import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from 'src/app/core/helpers/utils';
import { AcionamentoAnaliticoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/relatorio/acionamento.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AcionamentoService } from 'src/app/core/services/relatorio/acionamento.service';
import { OpcoesGrafico } from '../acoes-realizadas-por-contratante/acoes-realizadas-por-contratante.component';

@Component({
  selector: 'app-acoes-realizadas-por-usuario',
  templateUrl: './acoes-realizadas-por-usuario.component.html',
  styleUrl: './acoes-realizadas-por-usuario.component.scss'
})
export class AcoesRealizadasPorUsuarioComponent implements OnChanges {
  @Input() filtros: RequisicaoAcionamentoModel;
  public acoesAnaliticas: AcionamentoAnaliticoModel[] = [];
  public dadosTabela: any[] = [];
  public opcoesGrafico: Partial<OpcoesGrafico>;
  public colunaOrdenacao: string = 'contratante';

  public carregandoDados: boolean = false;
  linhaSelecionada: string = '';


constructor(
    private _servicoAcionamento: AcionamentoService,
    private _servicoAlert: AlertService,
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
    this._servicoAcionamento.obterAcionamentosAnalitico(dadosParaEnvio).subscribe({
      next: (res) => {
        this.carregandoDados = false;
        if (res.success === 'true') {
          this.acoesAnaliticas = res.dados;
          this.processarDados();
        } else {
          this._servicoAlert.warning(res.msg);
        }
      },
      error: () => {
        this.carregandoDados = false;
        this._servicoAlert.error('Erro ao carregar os dados.');
      }
    });
  }

  private processarDados() {
    const mapaUsuario = new Map<string, any>();

    this.acoesAnaliticas.forEach(item => {
      const chave = `${item.usuario}-${item.acao}`;  // Mudança: agora agrupamos por usuário
      if (mapaUsuario.has(chave)) {
        const existente = mapaUsuario.get(chave);
        existente.quantidade++;
        existente.ultimaData = new Date(existente.ultimaData) > new Date(item.data_acio)
          ? existente.ultimaData
          : item.data_acio;
      } else {
        mapaUsuario.set(chave, {
          usuario: item.usuario,  // Mudança: usamos o campo "usuario"
          acao: item.acao,
          quantidade: 1,
          ultimaData: item.data_acio
        });
      }
    });

    this.dadosTabela = Array.from(mapaUsuario.values());

    const categorias = Array.from(new Set(this.dadosTabela.map(d => d.usuario)));  // Mudança: exibimos o usuário no gráfico
    const dadosSeries = categorias.map(cat => {
      return this.dadosTabela
        .filter(d => d.usuario === cat)
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

  public atualizarGraficoPorUsuario(usuario: string) {
    this.linhaSelecionada = usuario;
    const dadosFiltrados = this.dadosTabela.filter(d => d.usuario === usuario);

    const categorias = Array.from(new Set(dadosFiltrados.map(d => d.acao)));
    const dadosSeries = categorias.map(cat => {
      return dadosFiltrados
        .filter(d => d.acao === cat)
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

  public formatarData(data) {
    if (data) {
      return Utils.formatarDataParaExibicao(data);
    }
  }
}

