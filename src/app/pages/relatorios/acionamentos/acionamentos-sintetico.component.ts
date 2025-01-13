import { Component, OnInit } from '@angular/core';
import { ChartType } from './apex.model';
import { barChart, basicColumChart, basicRadialBarChart, columnlabelChart, dashedLineChart, donutChart, lineColumAreaChart, linewithDataChart, simplePieChart, splineAreaChart } from './data';
import { AcionamentoService } from 'src/app/core/services/relatorio/acionamento.service';
import { AcionamentoAnaliticoModel, AcionamentoModel } from 'src/app/core/models/relatorio/acionamento.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { Utils } from 'src/app/core/helpers/utils';
import { ExcelService } from 'src/app/core/services/excel.service';
import { UsuarioModel } from 'src/app/core/models/cadastro/usuario.model';
import { UsuarioService } from 'src/app/core/services/cadastro/usuario.service';

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

  public formPesquisar: FormGroup;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public login = this._auth.getLogin();
  public acio_sintetico: AcionamentoModel[] = [];
  public acio_Analitico: AcionamentoAnaliticoModel[] = [];

  public loadingMin: boolean = false;
  public loading: boolean = false;
  public exibirCard: boolean = false;
  public tipoRelatorio: string = '0'; // Inicializa como '0' (nenhuma seleção)

  public usuarios: UsuarioModel[];
  public contratantes: ContratanteModel[] = [];
  public contratantesCarregados = false;
  public usuariosCarregados = false;

  constructor(
    private _acionamentoService: AcionamentoService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _datePipe: DatePipe,
    private _contratante: ContratanteService,
    private _excelService: ExcelService,
    private _usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    this.iniciarForm();
  }

  public iniciarForm() {
    this.formPesquisar = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: ['0'],
      id_usuario: ['0'],
      data_inicio: [this.primeirDiaMes(), Validators.required],
      data_fim: [this.ultimoDiaMes(), Validators.required],
      user_login: [this.login],
      tipo: ['', Validators.required]
    });
  }

  carregarContratantes(): void {
    if (!this.contratantesCarregados) {
      this.obterContratantes();
    }
  }

  carregarUsuarios(): void {
    if (!this.usuariosCarregados) {
      this.obterUsuarios();
    }
  }

  public pesquisar() {
    if (this.formPesquisar.invalid) {
      this.marcarCamposComoTocados(this.formPesquisar);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const tipoRelatorio = this.formPesquisar.value.tipo;
    this.tipoRelatorio = tipoRelatorio;

    if (tipoRelatorio === '1' || tipoRelatorio === '2') {
      this.exibirCard = true;

      if (tipoRelatorio === '1') {
        this.obterAcionamentosAnalitico()

      } else if (tipoRelatorio === '2') {
        this.obterAcionamentosSintetico();
        this._fetchData();
      }
    } else {
      this.exibirCard = false;
      this._alert.warning('Selecione um tipo de relatório antes de pesquisar.');
    }
  }

  private marcarCamposComoTocados(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      controle?.updateValueAndValidity();
    });
  }

  private primeirDiaMes() {
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    if (mes <= 9) {
      return ano + '-0' + mes + '-' + '01';
    }

    return ano + '-' + mes + '-' + '01';
  }

  private ultimoDiaMes(): string {
    let today = new Date();

    // Defina a data para o primeiro dia do próximo mês
    let primeiroDiaProximoMes = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    primeiroDiaProximoMes.setDate(primeiroDiaProximoMes.getDate() - 1);

    let data = primeiroDiaProximoMes.toISOString().split('T')[0];

    return data;
  }

  public exportExcel() {
    this._excelService.exportAsExcelFile(this.acio_Analitico, 'exportacaoAcionamentoAnalitico');
  }

  public obterUsuarios() {
    this.loading = true;
    this._usuarioService.obterUsuariosPorEmpresa(this.idEmpresa).subscribe((res) => {
      this.usuarios = res.contratantes;
      this.loading = false;
      this.usuariosCarregados = true;
    },
    (error) => {
      this._alert.error('Ocorreu um erro ao obter os usuários.');
      this.loading = false;
    });
  }

  public obterAcionamentosSintetico() {
    const dadosParaEnvio = { ...this.formPesquisar.value };
      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy");
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy");

    this.loadingMin = true;
    this._acionamentoService.obterAcionamentosSintetico(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.acio_sintetico = res.dados;

          // Ordena a coluna data em ordem descendente
          this.acio_sintetico.sort((a, b) => {
            if (a.total < b.total) return 1;
            if (a.total > b.total) return -1;
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

  public obterAcionamentosAnalitico() {
    const dadosParaEnvio = { ...this.formPesquisar.value };
      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy");
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy");

    this.loadingMin = true;
    this._acionamentoService.obterAcionamentosAnalitico(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.acio_Analitico = res.dados;

          // Ordena a coluna data em ordem descendente
          this.acio_Analitico.sort((a, b) => {
            if (a.data_acio < b.data_acio) return 1;
            if (a.data_acio > b.data_acio) return -1;
            return 0;
          });

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

  public obterContratantes() {
    this.loading = true;
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.loading = false;
      this.contratantes = res.contratantes;
      this.contratantesCarregados = true;
    },
      (error) => {
        this.loading = false;
        this._alert.error('Ocorreu um erro ao obter os contratantes.');
      }
    );
  }

  private _fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = { ...columnlabelChart, // Preserva as configurações existentes do gráfico
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

  public data(data) {
      if(data) {
        return Utils.formatarDataParaExibicao(data);
      }
    }
}
