import { DatePipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Log } from 'src/app/core/models/logs.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { LogsService } from 'src/app/core/services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  public logs: Log [] = [];
  public resultFiltros: Log [] = [];;
  public formFiltros: FormGroup;
  public filtros: boolean = false;
  public loading: boolean =false;
  public ativaAba: number = 1;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();

  public dadosFiltrados: Log[] = [];
  public textoPesquisa: string = "";
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Log>>;

  constructor(
      private _logsService: LogsService,
      private _auth: AuthenticationService,
      private _formBuilder: FormBuilder,
      private _datePipe: DatePipe,
      private _alertService: AlertService,
      private _excelService: ExcelService

    ) { }

ngOnInit(): void {
    this.iniciarForm();
  }

  public iniciarForm(): void {
    this.formFiltros = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      data_inicio: ["", Validators.required],
      data_fim: ["", Validators.required],
      user_login: [this.login, Validators.required],
    });
  }

  public obterFiltros() {
    if (this.formFiltros.valid) {
      const dadosParaEnvio = { ...this.formFiltros.value };

      dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
      dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";

      this.loading = true;

      this._logsService.listarLogs(dadosParaEnvio).subscribe((res) => {
        this.loading = false;
        if (res.success === 'true') {
          this.logs = res.logs;
          this.resultFiltros = res.logs;
          this.dadosFiltrados = res.logs;
          this.ativaAba = 2;

          this.ativaAba = 2;
        } else {
          this._alertService.error('Nenhum resultado encontrado.');
        }
      },
        (error) => {
          this.loading = false;
          this._alertService.error('Erro ao obter os filtros.');
        }
      );
    } else {
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

  public exportExcel() {
    this._excelService.exportAsExcelFile(this.dadosFiltrados, 'exportacaoLogs');
  }

  public ativarAba() {
    this.ativaAba = 1;
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
